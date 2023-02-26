import * as React from "react";
import { useRecoilState } from "recoil";
import {
  Flex,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from "@chakra-ui/react";

import { timers, Roles } from "../data/timer-data";

export function TimerSettingsForm({ id }: { id: string }) {
  // Each of the timers are individually subscribed to their own atoms:
  const [timer, setTimer] = useRecoilState(timers(id));

  // I'm using the timer atom to store the form state.
  return (
    <Flex
      flexDirection={"column"}
      rowGap={6}
      mb={12}
      color={timer.isRunning ? "gray.400" : "gray.600"}
    >
      <Heading size={"md"}>
        {timer.role === "work" ? "Work session" : "Break time"}
      </Heading>

      <label>
        Role
        <Select
          placeholder="Select role"
          value={timer.role}
          disabled={timer.isRunning}
          onChange={(e) => {
            setTimer((prev) => ({ ...prev, role: e.target.value as Roles }));
          }}
        >
          <option value="work">Work</option>
          <option value="rest">Rest</option>
        </Select>
      </label>

      {timer.role === "work" && (
        <label>
          Goal
          <Input
            value={timer.goal}
            onChange={(e) =>
              setTimer((prev) => ({ ...prev, goal: e.target.value }))
            }
            disabled={timer.isRunning}
          />
        </label>
      )}
      <label>
        Minutes
        <NumberInput
          value={timer.minutes}
          onChange={(string, number) =>
            setTimer((prev) => ({ ...prev, minutes: number }))
          }
        >
          <NumberInputField disabled={timer.isRunning} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </label>
    </Flex>
  );
}
