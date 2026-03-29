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
  const [categories, setCategories] = useState(["Food", "Transport", "Shopping", "Bills", "Other"]);
  const [budget, setBudget] = useState(0);
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [currency, setCurrency] = useState("$");

  // Sync budget and categories from settings
  useEffect(() => {
    if (!currentUser) {
      setBudget(0);
      setCategories(["Food", "Transport", "Shopping", "Bills", "Other"]);
      setCategoryBudgets({});
      return;
    }

    const q = query(
      collection(db, "settings"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setBudget(data.monthlyBudget || 0);
        setCategoryBudgets(data.categoryBudgets || {});
        setCurrency(data.currency || "$");
        if (data.categories) {
          setCategories(data.categories);
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
    try {
      await deleteDoc(doc(db, "expenses", id));
    } catch (error) {
      console.error("Error deleting expense: ", error);
    }
  };

  const deleteMultipleExpenses = async (ids) => {
    if (!ids || ids.length === 0) return;
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
