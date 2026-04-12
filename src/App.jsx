import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { ToastProvider, useToast } from "./contexts/ToastContext";
import { db } from "./firebase";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc, getDocs, writeBatch } from "firebase/firestore";
import "./App.css";
import "./styles/Auth.css";

function AppLayout() {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("All");
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [categories, setCategories] = useState(["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Housing", "Work", "Other"]);
  const [budget, setBudget] = useState(0);
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [currency, setCurrency] = useState("$");
  const [hasCheckedRecurring, setHasCheckedRecurring] = useState(false);

  // Sync budget and categories from settings
  useEffect(() => {
    if (!currentUser) {
      setBudget(0);
      setCategories(["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Housing", "Work", "Other"]);
      setCategoryBudgets({});
      return;
    }

    const q = query(
      collection(db, "settings"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (!snapshot.empty) {
        const docRef = doc(db, "settings", snapshot.docs[0].id);
        const data = snapshot.docs[0].data();
        setBudget(data.monthlyBudget || 0);
        setCategoryBudgets(data.categoryBudgets || {});
        setCurrency(data.currency || "$");

        // Essential categories that should always be present
        const essentialCategories = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Housing", "Work", "Other"];

        if (data.categories) {
          // Check if any essential categories are missing
          const missingCategories = essentialCategories.filter(cat => !data.categories.includes(cat));

          if (missingCategories.length > 0) {
            const updatedCategories = [...data.categories, ...missingCategories];
            setCategories(updatedCategories);
            // Proactively update Firestore to include new defaults
            await updateDoc(docRef, { categories: updatedCategories });
          } else {
            setCategories(data.categories);
          }
        } else {
          // If no categories exist yet, set the defaults
          setCategories(essentialCategories);
          await updateDoc(docRef, { categories: essentialCategories });
        }
      }
    });

    return unsubscribe;
  }, [currentUser]);

  const updateBudget = async (newBudget) => {
    if (!currentUser) return;
    try {
      const q = query(
        collection(db, "settings"),
        where("userId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(collection(db, "settings"), {
          userId: currentUser.uid,
          monthlyBudget: Number(newBudget),
          createdAt: Date.now()
        });
      } else {
        const docRef = doc(db, "settings", querySnapshot.docs[0].id);
        await updateDoc(docRef, {
          monthlyBudget: Number(newBudget),
          updatedAt: Date.now()
        });
      }
    } catch (error) {
      console.error("Error updating budget: ", error);
    }
  };

  const addCategory = async (newCategory) => {
    if (!currentUser || !newCategory) return;
    if (categories.includes(newCategory)) return;

    try {
      const q = query(
        collection(db, "settings"),
        where("userId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const updatedCategories = [...categories, newCategory];

      if (querySnapshot.empty) {
        await addDoc(collection(db, "settings"), {
          userId: currentUser.uid,
          categories: updatedCategories,
          createdAt: Date.now()
        });
      } else {
        const docRef = doc(db, "settings", querySnapshot.docs[0].id);
        await updateDoc(docRef, {
          categories: updatedCategories,
          updatedAt: Date.now()
        });
      }
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      setExpenses([]);
      return;
    }

    const q = query(
      collection(db, "expenses"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expensesData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })).sort((a, b) => a.createdAt - b.createdAt);

      setExpenses(expensesData);
    });

    return unsubscribe;
  }, [currentUser]);

  // Recurring expenses check: Runs once per session when expenses are loaded
  useEffect(() => {
    if (!currentUser || expenses.length === 0 || hasCheckedRecurring) return;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const recurringTemplates = expenses.filter(exp => exp.isRecurring);

    // Get all unique templates (by name, amount and category)
    const uniqueTemplatesMap = new Map();

    recurringTemplates.forEach(exp => {
      const key = `${exp.name}-${exp.category}-${exp.amount}`;
      if (!uniqueTemplatesMap.has(key)) {
        uniqueTemplatesMap.set(key, exp);
      }
    });

    uniqueTemplatesMap.forEach(async (tmpl) => {
      // Check if this recurring item already exists in the current month
      const existsInCurrentMonth = expenses.some(exp =>
        exp.name === tmpl.name &&
        exp.category === tmpl.category &&
        exp.amount === tmpl.amount &&
        exp.date?.slice(0, 7) === currentMonth
      );

      if (!existsInCurrentMonth) {
        // Auto-add for current month at the same day of month
        const day = tmpl.date?.slice(8, 10) || "01";
        const newDate = `${currentMonth}-${day}`;

        await addExpense({
          name: tmpl.name,
          amount: tmpl.amount,
          category: tmpl.category,
          date: newDate,
          isRecurring: true,
          isAutoGenerated: true
        });
      }
    });

    setHasCheckedRecurring(true);
  }, [expenses, currentUser, hasCheckedRecurring]);

  const addExpense = async (expense) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, "expenses"), {
        ...expense,
        userId: currentUser.uid,
        createdAt: Date.now()
      });
    } catch (error) {
      console.error("Error adding expense: ", error);
    }
  };

  const editExpense = async (id, updatedData) => {
    if (!currentUser) return;
    try {
      const docRef = doc(db, "expenses", id);
      await updateDoc(docRef, {
        ...updatedData,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error("Error updating expense: ", error);
    }
  };

  const deleteExpense = async (id) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, "expenses", id));
    } catch (error) {
      console.error("Error deleting expense: ", error);
    }
  };

  const deleteMultipleExpenses = async (ids) => {
    if (!currentUser || !ids || ids.length === 0) return;
    try {
      const batch = writeBatch(db);
      ids.forEach(id => {
        batch.delete(doc(db, "expenses", id));
      });
      await batch.commit();
    } catch (error) {
      console.error("Error deleting multiple expenses: ", error);
    }
  };

  const deleteAllExpenses = async () => {
    if (!currentUser) return;
    try {
      const q = query(
        collection(db, "expenses"),
        where("userId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (error) {
      console.error("Error deleting all expenses: ", error);
    }
  };

  return (
    <div className={currentUser ? "app-container" : ""}>
      {currentUser && <Sidebar />}

      <main className={currentUser ? "main-content" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              currentUser ? (
                <ProtectedRoute>
                  <Dashboard
                    expenses={expenses}
                    month={month}
                    setMonth={setMonth}
                    budget={budget}
                    updateBudget={updateBudget}
                    categoryBudgets={categoryBudgets}
                    currency={currency}
                  />
                </ProtectedRoute>
              ) : (
                <Landing />
              )
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Expenses
                  expenses={expenses}
                  addExpense={addExpense}
                  editExpense={editExpense}
                  deleteExpense={deleteExpense}
                  deleteMultipleExpenses={deleteMultipleExpenses}
                  deleteAllExpenses={deleteAllExpenses}
                  categories={categories}
                  addCategory={addCategory}
                  category={category}
                  setCategory={setCategory}
                  month={month}
                  setMonth={setMonth}
                  currency={currency}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports expenses={expenses} month={month} currency={currency} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings
                  expenses={expenses}
                  month={month}
                  categories={categories}
                  addCategory={addCategory}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppLayout />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
