
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from '@/components/WelcomeScreen';
import Calculator from '@/components/Calculator';
import ProjectForm from '@/components/ProjectForm';
import ClientForm from '@/components/ClientForm';
import BudgetPreview from '@/components/BudgetPreview';
import BudgetHistory from '@/components/BudgetHistory';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [step, setStep] = useState(0); // 0: Welcome, 1: 3D Calc, 2: Project Form, 3: Client Form, 4: Preview, 5: History
  const [budgetType, setBudgetType] = useState(null); // '3d' or 'project'
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

  const handleStart = (type) => {
    setBudgetType(type);
    if (type === '3d') {
      setStep(1);
    } else {
      setStep(2);
    }
  };

  const handleCalculationComplete = (data) => {
    setCalculationData(data);
    setStep(3);
  };

  const handleClientDataComplete = (data) => {
    setClientData(data);
    const newBudget = {
      id: `ORC-${Date.now().toString().slice(-6)}`,
      type: budgetType,
      calculationData: calculationData,
      clientData: data,
      createdAt: new Date().toISOString(),
    };
    setBudgets(prevBudgets => [newBudget, ...prevBudgets]);
    setStep(4);
  };

  const handleBack = () => {
    if (viewingBudget) {
      setViewingBudget(null);
      setStep(5); // Go back to history
      return;
    }
    switch(step) {
      case 1: // 3D Calc
      case 2: // Project Form
        setStep(0);
        break;
      case 3: // Client Form
        setStep(budgetType === '3d' ? 1 : 2);
        break;
      case 4: // Preview
        setStep(3);
        break;
      case 5: // History
        setStep(0);
        break;
      default:
        setStep(0);
    }
  };

  const handleNewBudget = () => {
    setStep(0);
    setCalculationData(null);
    setClientData(null);
    setViewingBudget(null);
    setBudgetType(null);
  };

  const showHistory = () => {
    setStep(5);
  };

  const viewBudgetFromHistory = (budget) => {
    setViewingBudget(budget);
    setStep(4);
  };

  const deleteBudget = (budgetId) => {
    setBudgets(budgets.filter(b => b.id !== budgetId));
  };

  const currentBudget = viewingBudget || { calculationData, clientData, type: budgetType };

  const renderStep = () => {
    switch(step) {
      case 0:
        return <WelcomeScreen key="welcome" onStart={handleStart} />;
      case 1:
        return budgetType === '3d' ? <Calculator key="calculator" onComplete={handleCalculationComplete} onShowHistory={showHistory} onBack={handleBack} /> : null;
      case 2:
        return budgetType === 'project' ? <ProjectForm key="project-form" onComplete={handleCalculationComplete} onBack={handleBack} onShowHistory={showHistory} /> : null;
      case 3:
        return <ClientForm key="client-form" calculationData={calculationData} onComplete={handleClientDataComplete} onBack={handleBack} />;
      case 4:
        return currentBudget.calculationData && currentBudget.clientData ? <BudgetPreview key="budget-preview" budget={currentBudget} onBack={handleBack} onNewBudget={handleNewBudget} /> : null;
      case 5:
        return <BudgetHistory key="budget-history" budgets={budgets} onViewBudget={viewBudgetFromHistory} onDeleteBudget={deleteBudget} onBack={handleNewBudget} />;
      default:
        return <WelcomeScreen key="welcome" onStart={handleStart} />;
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Calculadora 3D e Projetos - Nanda 3D Arte</title>
        <meta name="description" content="Calcule o valor de impressões 3D e projetos, gere e salve orçamentos profissionais instantaneamente." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl relative z-10"
        >
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </motion.div>

        <Toaster />
      </div>
    </React.Fragment>
  );
}

export default App;
