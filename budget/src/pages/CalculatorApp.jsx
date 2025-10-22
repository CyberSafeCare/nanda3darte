
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from '@/components/WelcomeScreen';
import Calculator from '@/components/Calculator';
import ClientForm from '@/components/ClientForm';
import BudgetPreview from '@/components/BudgetPreview';
import BudgetHistory from '@/components/BudgetHistory';

function CalculatorApp() {
  const [step, setStep] = useState(0); // 0: Welcome, 1: Calculator, 2: Client, 3: Preview, 4: History
  const [calculationData, setCalculationData] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [budgets, setBudgets] = useState(() => {
    try {
      const savedBudgets = localStorage.getItem('budgets');
      return savedBudgets ? JSON.parse(savedBudgets) : [];
    } catch (error) {
      return [];
    }
  });
  const [viewingBudget, setViewingBudget] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('budgets', JSON.stringify(budgets));
    } catch (error) {
      console.error("Failed to save budgets:", error);
    }
  }, [budgets]);

  const handleStart = () => {
    setStep(1);
  };

  const handleCalculationComplete = (data) => {
    setCalculationData(data);
    setStep(2);
  };

  const handleClientDataComplete = (data) => {
    setClientData(data);
    const newBudget = {
      id: `ORC-${Date.now().toString().slice(-6)}`,
      calculationData: calculationData,
      clientData: data,
      createdAt: new Date().toISOString(),
    };
    setBudgets(prevBudgets => [newBudget, ...prevBudgets]);
    setStep(3);
  };

  const handleBack = () => {
    if (viewingBudget) {
      setViewingBudget(null);
      setStep(4); // Go back to history
    } else if (step === 1) {
      setStep(0); // Go back to welcome screen
    } else if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      setStep(1);
    }
  };

  const handleNewBudget = () => {
    setStep(1);
    setCalculationData(null);
    setClientData(null);
    setViewingBudget(null);
  };

  const showHistory = () => {
    setStep(4);
  };

  const viewBudgetFromHistory = (budget) => {
    setViewingBudget(budget);
    setStep(3);
  };

  const deleteBudget = (budgetId) => {
    setBudgets(budgets.filter(b => b.id !== budgetId));
  };

  const currentBudget = viewingBudget || { calculationData, clientData };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
         {step === 0 && (
          <WelcomeScreen 
            key="welcome"
            onStart={handleStart}
          />
        )}
        {step === 1 && (
          <Calculator 
            key="calculator"
            onComplete={handleCalculationComplete}
            onShowHistory={showHistory}
            onBack={handleBack}
          />
        )}
        
        {step === 2 && (
          <ClientForm
            key="client-form"
            calculationData={calculationData}
            onComplete={handleClientDataComplete}
            onBack={handleBack}
          />
        )}
        
        {step === 3 && currentBudget.calculationData && currentBudget.clientData && (
          <BudgetPreview
            key="budget-preview"
            budget={currentBudget}
            onBack={handleBack}
            onNewBudget={handleNewBudget}
          />
        )}

        {step === 4 && (
          <BudgetHistory
            key="budget-history"
            budgets={budgets}
            onViewBudget={viewBudgetFromHistory}
            onDeleteBudget={deleteBudget}
            onBack={handleBack}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default CalculatorApp;
