import { useCallback, useEffect, useState } from 'react';
import { useInterval } from '../hooks/use-interval';
import { Timer } from './timer';
import { Button } from './button';
import bellStart from '../sounds/src_bell_start.mp3';
import bellFinish from '../sounds/src_bell_finish.mp3';
import { secondsToTime } from '../utils/seconds-to-time';

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props) {
  const [mainTime, setMainTime] = useState(props.pomodoroTime);
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesQtdManager, setCyclesQtdManager] = useState(
    new Array(props.cycles - 1).fill(true),
  );
  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

  const configureWork = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTime);
    audioStartWorking.play();
  }, [props.pomodoroTime]);
  const configureRest = useCallback(
    (long: boolean) => {
      setTimeCounting(true);
      setResting(true);
      setWorking(false);
      audioStopWorking.play();

      if (long) {
        setMainTime(props.longRestTime);
      } else {
        setMainTime(props.shortRestTime);
      }
    },
    [props.longRestTime, props.shortRestTime],
  );

  useEffect(() => {
    if (working) {
      document.body.classList.add('working');
    }
    if (resting) {
      document.body.classList.remove('working');
    }

    if (mainTime > 0) return;

    if (working && cyclesQtdManager.length > 0) {
      configureRest(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      configureRest(true);
      setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
    if (resting) configureWork();
  }, [
    working,
    resting,
    mainTime,
    cyclesQtdManager,
    props.cycles,
    configureRest,
    numberOfPomodoros,
    configureWork,
    completedCycles,
  ]);

  useInterval(
    () => {
      setMainTime(mainTime - 1);

      if (working) setFullWorkingTime(fullWorkingTime + 1);
    },
    timeCounting ? 1000 : null,
  );
  return (
    <div className="pomodoro">
      <h2>Você está: {working ? 'Trabalhando' : 'Descansando'}</h2>
      <Timer mainTime={mainTime} />

      <div className="controls">
        <Button text="Work" onClick={() => configureWork()}></Button>
        <Button text="Rest" onClick={() => configureRest(false)}></Button>
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCounting ? 'Pause' : 'Play'}
          onClick={() => setTimeCounting(!timeCounting)}
        ></Button>
      </div>

      <div className="details">
        <p>Ciclos concluídos: {completedCycles}</p>
        <p>Tempo total de trabalho: {secondsToTime(fullWorkingTime)}</p>
        <p>Números de pomodoros concluídos: {numberOfPomodoros}</p>
      </div>
    </div>
  );
}
