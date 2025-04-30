"use client";

import { useState, useEffect, useRef } from "react";

export function useFormStatus() {
  const [formState, setFormState] = useState({
    pending: false,
    data: null,
    method: "GET" as const,
    action: null
  });
  
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    // Form submit event dinleyicisi
    const handleSubmitStart = (event: Event) => {
      if (event.target instanceof HTMLFormElement) {
        // Formun referansını saklayalım
        formRef.current = event.target;
        setFormState(prev => ({ ...prev, pending: true }));
      }
    };

    // Form onload event dinleyicisi (sunucu yanıtı geldiğinde)
    const handleLoadComplete = () => {
      // Eğer izlediğimiz form işlemi tamamlandıysa pending'i false yapalım
      if (formRef.current) {
        setFormState(prev => ({ ...prev, pending: false }));
        formRef.current = null;
      }
    };

    document.addEventListener('submit', handleSubmitStart);
    window.addEventListener('load', handleLoadComplete);
    
    return () => {
      document.removeEventListener('submit', handleSubmitStart);
      window.addEventListener('load', handleLoadComplete);
    };
  }, []);

  return formState;
}