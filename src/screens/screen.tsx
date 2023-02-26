import React, { Suspense } from "react";
import { Settings } from "../components/settings";
import { Flex } from "@chakra-ui/react";
import { Timers } from "../components/timers";

export function Screen() {
  return (
    <Flex width={"100%"}>
      <Suspense fallback={"suspense, woo"}>
        <Settings />
        <Timers />
      </Suspense>
    </Flex>
  );
}
