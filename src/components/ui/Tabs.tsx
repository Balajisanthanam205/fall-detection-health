import * as React from 'react';

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export const Tabs = ({ defaultValue, children }: TabsProps) => {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <TabsContext.Provider
      value={{
        value,
        onValueChange: setValue,
      }}
    >
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: React.ReactNode;
}

export const TabsList = ({ children }: TabsListProps) => {
  return (
    <div className="inline-flex items-center justify-center rounded-md bg-gray-100 dark:bg-slate-700 p-1">
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

export const TabsTrigger = ({ value, children }: TabsTriggerProps) => {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }
  
  const { value: selectedValue, onValueChange } = context;
  const isSelected = selectedValue === value;
  
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      data-state={isSelected ? 'active' : 'inactive'}
      className={`
        px-3 py-1.5 text-sm font-medium transition-all
        ${
          isSelected
            ? 'bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-300 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
        }
        rounded-md
      `}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export const TabsContent = ({ value, children }: TabsContentProps) => {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }
  
  const { value: selectedValue } = context;
  const isSelected = selectedValue === value;
  
  if (!isSelected) return null;
  
  return <div className="mt-2">{children}</div>;
};