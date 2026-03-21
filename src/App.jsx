import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { db } from "./firebase";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import "./App.css";
import "./styles/Auth.css";
// Main App layout requires knowing if user is logged in to show Sidebar
function AppLayout() {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("All");
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

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
                <Dashboard expenses={expenses} month={month} setMonth={setMonth} />
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
                  deleteExpense={deleteExpense}
                  category={category}
                  setCategory={setCategory}
                  month={month}
                  setMonth={setMonth}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports expenses={expenses} month={month} />
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
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
