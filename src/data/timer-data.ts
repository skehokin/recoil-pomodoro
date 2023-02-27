import { atom, atomFamily, DefaultValue, selectorFamily } from "recoil";
import { memoize } from "lodash";
import dayjs from "dayjs";

export type Roles = "work" | "rest";

export interface Timer {
  minutes: number;
  role: Roles;
  goal?: string;
  id: string;
  isRunning?: boolean;
  timeEnds?: dayjs.Dayjs;
  currentMinutes?: number;
  alarmOn?: boolean;
}

interface CreateTimerParams {
  id: string;
}

// Recoil is an open-source state management library for React, which was created by Facebook devs.
// The idea is that it would replace Redux or Context in your app

// It's especially useful for managing state that is shared across multiple components,
// when you don't want to cause a re-render of the entire app.

// Atoms
// Atoms are the basic building blocks of Recoil.
// This is a single atom, which a component can subscribe to independently using hooks

// e.g. const [timer, setTimer] = useRecoilState(timerAtom);
// You can see the hook API is very similar to useState.

const anAtom = atom({
  key: `single-timer`,
  default: { id: "myId", minutes: 25, role: "work", goal: "" },
});

// For more complex state, or related pieces of state that change independently,
// we can create a set of similar atoms.
// This is a function that creates an atom based on the id.
export const timerAtom = memoize(({ id }: CreateTimerParams) =>
  atom({
    key: `timer-${id}`,
    default: { id, minutes: 25, role: "work", goal: "" },
  })
);

// atomFamily

// atomFamily is an in-built helper which is basically the same as above,
// the atomFamily function does the memoizing for us and stores a unique key
// internally for each atom.
const timerFamily = atomFamily<Timer, string>({
  key: "timer",
  default: (id) => ({ id, minutes: 25, role: "work", goal: "" }),
  effects: [startTimerEffect],
});

// Selectors

// This is a selector, which allows us to supply derived state.
// It returns the same type of value as an atom (RecoilState),
// so it can be accessed via the same hooks.
// This is a simple selector which only reads from the atom.

// Using this selector:
// const end = useRecoilValue(endsAtSelector(id));
export const endsAtSelector = selectorFamily<dayjs.Dayjs, string>({
  key: "endsAt",
  get:
    (id) =>
    ({ get }) => {
      const { currentMinutes, minutes } = get(timerAtom(id)) as Timer;

      return dayjs().add(currentMinutes || minutes, "minutes");
    },
});

// I have a problem with my atomFamily, which is that I want to use it to make a list of multiple timers
// but in order to access the timer from atomFamily, I need to know what its id is.
// So I need a separate atom to keep track of the id for each timer.
export const timerIds = atom<string[]>({
  key: "timerIds",
  default: [],
});

// After that, I need to use some mechanism to update the list of ids when the timerFamily is updated.
// I could use an atomEffect, but in this case I went with a selectorFamily.
// This selectorFamily can both read and write to the atomFamily.
export const timers = selectorFamily({
  key: "timer-access",
  get:
    (id: string) =>
    ({ get }) => {
      const atom = get(timerFamily(id));
      return atom;
    },
  set:
    (id) =>
    ({ set, reset }, newTimerValue) => {
      if (newTimerValue instanceof DefaultValue) {
        // DefaultValue can be used to reset like so
        // reset(timerFamily(id));
        // reset(timerIds);
        return;
      }

      // When I update the timers selector family, it updates the atom in the atomFamily
      set(timerFamily(id), newTimerValue);

      // If my timer is new, I also add it to the list of ids
      set(timerIds, (prev) => {
        if (prev.includes(newTimerValue.id)) {
          return prev;
        }
        return [...prev, newTimerValue.id];
      });
    },
});

// So how am I using this...?

// Effects
// In order to manage the timer functionality, I'm using an atomEffect
// this is passed into the 'effects' array when creating the atomFamily.

// ? this is probably going to interfere with itself
let interval: number | undefined;

//additionally passed to an atomEffect:
// https://recoiljs.org/docs/guides/atom-effects/

function startTimerEffect({ setSelf, onSet }) {
  // onSet subscribes to changes in the atom value but
  // doesn't run after its own setSelf is called.
  onSet((newValue, oldValue) => {
    // since atomEffects run on every change to the atom.
    // this pattern is more like the old componentDidUpdate than useEffect,
    const justPaused =
      !newValue.isRunning &&
      !(oldValue instanceof DefaultValue) &&
      oldValue.isRunning;

    const justStarted =
      newValue.isRunning &&
      (oldValue instanceof DefaultValue || !oldValue.isRunning);

    // in this onSet, I'm managing pausing and starting the timer.

    if (justPaused) {
      clearInterval(interval);
      return;
    }

    if (justStarted) {
      interval = setInterval(() => {
        const timeLeft = newValue.timeEnds?.diff(dayjs(), "seconds");
        setSelf((prev) => {
          if (prev instanceof DefaultValue) {
            return prev;
          }
          return {
            ...prev,
            currentMinutes: timeLeft ? timeLeft / 60 : 0,
          };
        });
      }, 1000);
    }
  });

  // You can call onSet multiple times within a callback,
  // I'm using this to respond to the other onSet call.
  onSet((newValue) => {
    // Here I'm completing the timer and running an alarm.
    if (dayjs().isAfter(newValue.timeEnds) && newValue.isRunning) {
      clearInterval(interval);
      setSelf((prev) => {
        if (prev instanceof DefaultValue) {
          return prev;
        }
        return {
          ...prev,
          isRunning: false,
          alarmOn: true,
        };
      });
    }
  });

  // final clean up
  return () => clearInterval(interval);
}
