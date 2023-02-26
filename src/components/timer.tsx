import * as React from "react";
import {
  useRecoilState,
  useRecoilStateLoadable,
  useResetRecoilState,
} from "recoil";
import dayjs from "dayjs";
import { Center, Flex, Heading, ScaleFade, Text } from "@chakra-ui/react";
import { timers, timerIds } from "../data/timer-data";
import tomatoTop from "../assets/tomato-top.png?url";
import alert from "../assets/alert.wav";

const audio = new Audio(alert);

export function Timer({ id }: { id: string }) {
  const alarmInterval = React.useRef<number>();

  const [show, setShow] = React.useState(true);

  const [timer, setTimer] = useRecoilStateLoadable(timers(id));
  const reset = useResetRecoilState(timers(id));

  const [_timerIds, setTimerIds] = useRecoilState(timerIds);

  const onClickPlay = () => {
    if (timer.contents?.alarmOn) {
      // Stop alarm
      audio.pause();
      clearInterval(alarmInterval.current);
      // "remove" atom
      reset();
      setTimerIds((prev) => prev.filter((id) => id !== timer.id));
      return;
    }

    if (timer.contents?.isRunning) {
      setTimer(() => ({
        ...timer.contents,
        isRunning: false,
      }));
      return;
    }

    // The timer functionality is the final big piece of recoil stuff in this demo.
    const timeEnds = dayjs().add(
      timer.contents?.currentMinutes || timer.contents.minutes,
      "minute"
    );
    setTimer(() => ({ ...timer.contents, isRunning: true, timeEnds }));
  };

  React.useEffect(() => {
    if (timer.contents.alarmOn) {
      audio.play();
      alarmInterval.current = setInterval(() => {
        setShow((prev) => !prev);
        audio.play();
      }, 200);
    }

    if (!timer.contents?.alarmOn) {
      clearInterval(alarmInterval.current);
      audio.pause();
    }

    return () => {
      clearInterval(alarmInterval?.current);
    };
  }, [timer.contents?.alarmOn]);

  console.log(timer?.contents);
  return (
    <ScaleFade initialScale={0.9} in={show}>
      <Flex
        width={"300px"}
        height={"300px"}
        flexDirection={"column"}
        margin={2}
        backgroundImage={`url('${timer.contents?.image || tomatoTop}')`}
        backgroundSize={"cover"}
        onClick={onClickPlay}
      >
        <Center color={"white"} flexDirection={"column"} m={"auto"}>
          <Heading>{timer.contents?.role}</Heading>
          <Text>{timer.contents?.goal}</Text>
          <Heading>{timer.contents?.minutes} min</Heading>
          <Heading>{timer.contents?.isRunning ? "■" : "▶"}</Heading>
          {timer.contents?.isRunning && (
            <>
              <Heading>{timer.contents?.currentMinutes?.toFixed(2)}</Heading>
              <Text>ends at {timer.contents?.timeEnds?.format("HH:mm")}</Text>
            </>
          )}
        </Center>
      </Flex>
    </ScaleFade>
  );
}
