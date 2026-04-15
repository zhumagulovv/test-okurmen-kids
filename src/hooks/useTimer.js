import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementTimer, startTimer, stopTimer, resetTimer } from '../features/quiz/quizSlice';

export const useTimer = () => {
  const dispatch = useDispatch();
  const { isRunning } = useSelector((state) => state.quiz);
  const intervalRef = useRef(null);

  const start = () => {
    if (!isRunning) {
      dispatch(startTimer())
    }
  };
  const stop = () => {
    if (isRunning) {
      dispatch(stopTimer())
    }
  };
  const reset = () => {
    dispatch(resetTimer())
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        dispatch(incrementTimer());
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, dispatch]);

  return { start, stop, reset };
};
