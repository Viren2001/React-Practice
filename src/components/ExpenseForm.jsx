import { useState, useRef } from "react";
import { getCategoryIcon } from "../utils/categoryIcons";
import { Check, X, Sparkles, Trash2, Upload, FileImage, Loader2, AlertCircle } from "lucide-react";
import CustomDropdown from "./CustomDropdown";
import { autoCategorize } from "../utils/autoCategorize";
import { parseReceiptImage } from "../utils/geminiService";
import { useToast } from "../contexts/ToastContext";

function ExpenseForm({ addExpense, categories = [], addCategory, deleteCategory }) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState(categories[0] || "Food");
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [hasManuallyChangedCategory, setHasManuallyChangedCategory] = useState(false);
    const [isAutoSuggesting, setIsAutoSuggesting] = useState(false);
    const [isRecurring, setIsRecurring] = useState(false);

    // Scanner States
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);
    const toast = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !amount || !category) {
            return alert("Please fill all required fields (name, amount, category)");
        }

        addExpense({
            id: Date.now(),
            name,
            amount: parseFloat(amount),
            category,
            date: date || new Date().toISOString().slice(0, 10),
            isRecurring,
        });

        setName("");
        setAmount("");
        setCategory(categories[0] || "Food");
        setDate(new Date().toISOString().slice(0, 10));
        setHasManuallyChangedCategory(false);
        setIsAutoSuggesting(false);
        setIsRecurring(false);
    };

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setName(newName);

        if (!hasManuallyChangedCategory) {
            const suggestedCategory = autoCategorize(newName);
            if (suggestedCategory && categories.includes(suggestedCategory)) {
                setCategory(suggestedCategory);
                setIsAutoSuggesting(true);
            } else {
                setIsAutoSuggesting(false);
            }
        }
    };

    const handleCategoryChange = (val) => {
        if (val === "ADD_NEW") {
            setIsAddingCategory(true);
        } else {
            setCategory(val);
            setHasManuallyChangedCategory(true);
            setIsAutoSuggesting(false);
        }
    };

    const handleSaveNewCategory = (e) => {
        if (e) e.stopPropagation();
        if (newCategoryName.trim()) {
            addCategory(newCategoryName.trim());
            setCategory(newCategoryName.trim());
            setNewCategoryName("");
            setIsAddingCategory(false);
        } else {
            handleCancelNewCategory();
        }
    };

    const handleCancelNewCategory = (e) => {
        if (e) e.stopPropagation();
        setIsAddingCategory(false);
        setNewCategoryName("");
        setCategory(categories[0] || "Food");
    };

    // File/Drag Handlers for Receipt Vision Scanning
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64Str = reader.result.split(',')[1];
                resolve(base64Str);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const processReceiptFile = async (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setScanError("Please upload an image file (PNG, JPG, WEBP).");
            return;
        }

        setIsScanning(true);
        setScanError("");

        try {
            const base64 = await fileToBase64(file);
            toast.info("Analyzing receipt with Cyber-AI...");
            const parsed = await parseReceiptImage(base64, file.type, categories);
            
            if (parsed) {
                if (parsed.name) setName(parsed.name);
                if (parsed.amount) setAmount(String(parsed.amount));
                if (parsed.category) {
                    // Check if it's in user categories
                    if (categories.includes(parsed.category)) {
                        setCategory(parsed.category);
                    } else {
                        // Dynamically add category if it's returned by Gemini
                        addCategory(parsed.category);
                        setCategory(parsed.category);
                    }
                }
                if (parsed.date) setDate(parsed.date);
                
                setIsAutoSuggesting(true);
                toast.success("Receipt parsed successfully! Verify and save.");
            }
        } catch (err) {
            console.error(err);
            setScanError("Failed to parse receipt. Please verify API key or fill details manually.");
            toast.error("Receipt scanning failed.");
        } finally {
            setIsScanning(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        processReceiptFile(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processReceiptFile(e.dataTransfer.files[0]);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            {/* Receipt Vision Scanner Box */}
            <div 
                className={`receipt-scanner-zone ${dragActive ? "drag-active" : ""}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
            >
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    style={{ display: "none" }} 
                />

                {isScanning ? (
                    <div className="receipt-scanner-loading">
                        <Sparkles className="scanner-sparkle-loader" size={28} />
                        <span className="receipt-scanner-text">Neural Network Analyzing Receipt...</span>
                        <div className="scan-progress-bar-container">
                            <div className="scan-progress-bar-fill"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="receipt-scanner-icon-wrap">
                            <Upload size={20} />
                        </div>
                        <div>
                            <span className="receipt-scanner-text">Upload or Drop Receipt Image</span>
                            <p className="receipt-scanner-subtext">Gemini Vision will auto-fill name, price, category, and date</p>
                        </div>
                    </>
                )}

                {scanError && (
                    <div className="scan-error-msg">
                        <AlertCircle size={14} />
                        <span>{scanError}</span>
                    </div>
                )}
            </div>

            {/* Standard Form fields */}
            <form onSubmit={handleSubmit} style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                alignItems: "end"
            }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Expense Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Starbucks Coffee"
                        value={name}
                        onChange={handleNameChange}
                        required
                        style={{ height: "48px" }}
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        style={{ height: "48px" }}
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Category</label>
                        {isAutoSuggesting && (
                            <span style={{
                                fontSize: "10px",
                                color: "var(--primary)",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontWeight: "600",
                                background: "var(--primary-light)",
                                padding: "2px 6px",
                                borderRadius: "10px",
                                border: "1px solid var(--primary-glow)"
                            }}>
                                <Sparkles size={10} /> Auto-suggested
                            </span>
                        )}
                    </div>
                    <div style={{ position: "relative", display: "flex", alignItems: "center", overflow: "visible" }}>
                        {!isAddingCategory ? (
                            <div style={{ flex: 1, overflow: "visible" }}>
                                <CustomDropdown
                                    options={[...categories, "+ Add New"]}
                                    value={category}
                                    onChange={(val) => {
                                        if (val === "+ Add New") setIsAddingCategory(true);
                                        else handleCategoryChange(val);
                                    }}
                                    onDelete={(cat) => {
                                        if (window.confirm(`Delete category "${cat}"?`)) {
                                            deleteCategory(cat);
                                        }
                                    }}
                                    icon={getCategoryIcon(category)}
                                    searchable={true}
                                />
                            </div>
                        ) : (
                            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px", position: "relative" }}>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Category name..."
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveNewCategory(e);
                                        if (e.key === 'Escape') handleCancelNewCategory(e);
                                    }}
                                    style={{ paddingRight: "70px" }}
                                />
                                <div style={{
                                    position: "absolute",
                                    right: "6px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    display: "flex",
                                    gap: "4px"
                                }}>
                                    <button
                                        type="button"
                                        onClick={handleSaveNewCategory}
                                        title="Save Category"
                                        style={{
                                            width: "28px",
                                            height: "28px",
                                            padding: 0,
                                            background: "var(--success)",
                                            color: "white",
                                            borderRadius: "6px"
                                        }}
                                    >
                                        <Check size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancelNewCategory}
                                        title="Cancel"
                                        style={{
                                            width: "28px",
                                            height: "28px",
                                            padding: 0,
                                            background: "var(--bg-app)",
                                            border: "1px solid var(--border)",
                                            color: "var(--text-muted)",
                                            borderRadius: "6px"
                                        }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{ height: "48px" }}
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "transparent", textTransform: "uppercase", userSelect: "none" }}>Recurring</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", height: "48px", background: "rgba(var(--bg-card-rgb), 0.5)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "0 16px" }}>
                        <input
                            type="checkbox"
                            id="isRecurring"
                            checked={isRecurring}
                            onChange={(e) => setIsRecurring(e.target.checked)}
                            style={{
                                width: "18px",
                                height: "18px",
                                cursor: "pointer",
                                accentColor: "var(--primary)",
                                border: "1px solid var(--border)"
                            }}
                        />
                        <label htmlFor="isRecurring" style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-main)", cursor: "pointer", margin: 0 }}>RECURRING</label>
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "transparent", textTransform: "uppercase", userSelect: "none" }}>Action</label>
                    <button
                        type="submit"
                        style={{
                            backgroundColor: "var(--primary)",
                            color: "white",
                            boxShadow: "0 4px 12px var(--primary-glow)",
                            height: "48px",
                            width: "100%"
                        }}
                    >
                        Add Transaction
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ExpenseForm;