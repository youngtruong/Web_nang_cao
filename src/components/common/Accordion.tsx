import React, {
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface AccordionContextValue {
  openValue: string | null;
  toggleItem: (value: string) => void;
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error('Accordion components must be used inside <Accordion>.');
  }

  return context;
};

const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);

  if (!context) {
    throw new Error('Accordion.Trigger and Accordion.Content must be used inside <Accordion.Item>.');
  }

  return context;
};

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string | null;
  onValueChange?: (value: string | null) => void;
}

const AccordionRoot: React.FC<AccordionProps> = ({
  children,
  className,
  defaultValue,
  value,
  onValueChange,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? null);
  const isControlled = value !== undefined;
  const openValue = isControlled ? value : internalValue;

  const contextValue = useMemo<AccordionContextValue>(
    () => ({
      openValue,
      toggleItem: (itemValue) => {
        const nextValue = openValue === itemValue ? null : itemValue;

        if (!isControlled) {
          setInternalValue(nextValue);
        }

        onValueChange?.(nextValue);
      },
    }),
    [isControlled, onValueChange, openValue],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn('divide-y divide-gray-200 dark:divide-gray-700', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ value, children, className, ...props }) => {
  const { openValue } = useAccordionContext();
  const id = useId();
  const contextValue = useMemo<AccordionItemContextValue>(
    () => ({
      value,
      isOpen: openValue === value,
      triggerId: `accordion-trigger-${id}`,
      contentId: `accordion-content-${id}`,
    }),
    [id, openValue, value],
  );

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <div className={cn('first:rounded-t-xl last:rounded-b-xl', className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

export type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, className, onClick, ...props }) => {
  const { toggleItem } = useAccordionContext();
  const { value, isOpen, triggerId, contentId } = useAccordionItemContext();

  return (
    <button
      type="button"
      id={triggerId}
      aria-expanded={isOpen}
      aria-controls={contentId}
      className={cn(
        'flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 dark:text-gray-100 dark:hover:bg-gray-800/70',
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggleItem(value);
      }}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        aria-hidden="true"
        className={cn('h-5 w-5 shrink-0 text-gray-500 transition-transform', isOpen && 'rotate-180')}
      />
    </button>
  );
};

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

const AccordionContent: React.FC<AccordionContentProps> = ({ children, className, ...props }) => {
  const { isOpen, triggerId, contentId } = useAccordionItemContext();

  return (
    <div
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      hidden={!isOpen}
      className={cn('px-5 pb-5 text-base leading-7 text-gray-600 dark:text-gray-300', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
