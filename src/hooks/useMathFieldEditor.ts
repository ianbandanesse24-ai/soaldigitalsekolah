import { FocusEvent, useCallback, useRef, useState } from 'react';
import { convertAsciiMathToUnicode } from '../utils/mathSymbols';

interface ActiveUpdater {
  label: string;
  applyValue: (next: string) => void;
}

export function useMathFieldEditor() {
  const activeElementRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
    null
  );
  const activeUpdaterRef = useRef<ActiveUpdater | null>(null);
  const [activeFieldLabel, setActiveFieldLabel] = useState<string | null>(null);

  const bindMathField = useCallback(
    (label: string, applyValue: (next: string) => void) => {
      return (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        activeElementRef.current = e.currentTarget;
        activeUpdaterRef.current = { label, applyValue };
        setActiveFieldLabel(label);
      };
    },
    []
  );

  const insertAtCursor = useCallback((snippet: string) => {
    const el = activeElementRef.current;
    const updater = activeUpdaterRef.current;
    if (!el || !updater || !document.body.contains(el)) return;

    const current = el.value ?? '';
    const start = el.selectionStart ?? current.length;
    const end = el.selectionEnd ?? current.length;
    const next = current.slice(0, start) + snippet + current.slice(end);
    updater.applyValue(next);

    const nextCursor = start + snippet.length;
    requestAnimationFrame(() => {
      if (document.body.contains(el)) {
        el.focus();
        try {
          el.setSelectionRange(nextCursor, nextCursor);
        } catch {
          // Abaikan jika tipe input tidak mendukung selectionRange
        }
      }
    });
  }, []);

  const convertActiveNotation = useCallback(() => {
    const el = activeElementRef.current;
    const updater = activeUpdaterRef.current;
    if (!el || !updater || !document.body.contains(el)) return;

    const current = el.value ?? '';
    const next = convertAsciiMathToUnicode(current);
    if (next !== current) {
      updater.applyValue(next);
    }
    requestAnimationFrame(() => {
      if (document.body.contains(el)) {
        el.focus();
      }
    });
  }, []);

  return {
    activeFieldLabel,
    bindMathField,
    insertAtCursor,
    convertActiveNotation,
  };
}
