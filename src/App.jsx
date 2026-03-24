import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { ToastProvider, useToast } from "./contexts/ToastContext";
import { db } from "./firebase";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc, getDocs } from "firebase/firestore";
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
  const [budget, setBudget] = useState(0);
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [currency, setCurrency] = useState("$");

  // Sync budget from settings
  useEffect(() => {
    if (!currentUser) {
      setBudget(0);
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
                <Settings expenses={expenses} month={month} />
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
