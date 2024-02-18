import { useState, useCallback } from "react";

export const useAttempts = (initialAttempts = 6) => {
  const [attemptsLeft, setAttemptsLeft] = useState(initialAttempts);

  const decrementAttempts = useCallback(() => {
    setAttemptsLeft((attempts) => attempts - 1);
  }, []);

  const resetAttempts = useCallback(() => {
    setAttemptsLeft(initialAttempts);
  }, [initialAttempts]);

  return { attemptsLeft, decrementAttempts, resetAttempts };
};
