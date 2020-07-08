import React, { useState, useRef, useEffect } from "react";
import useInterval from "../hooks/useInterval";
import styled from "styled-components";

const Page = () => {
  const ballRef = useRef();
  const paddleRef = useRef();

  const [topDist, setTopDist] = useState(0);
  const [leftDist, setLeftDist] = useState(0);
  const [lives, setLives] = useState(5);
  const [vertTrigger, setVertTrigger] = useState();
  const [horiTrigger, setHoriTrigger] = useState();
  const [paddlePos, setPaddlePos] = useState(0);
  const ballMovement = 4;
  const paddleMovement = 15;

  const getPaddleLimits = () => {
    return {
      top: paddleRef.current.offsetTop - paddleRef.current.offsetHeight,
      right: paddleRef.current.offsetLeft + paddleRef.current.offsetWidth,
      bottom: paddleRef.current.offsetTop,
      left: paddleRef.current.offsetLeft,
    };
  };

  const substractLife = () => {
    setTopDist(0);
    setLeftDist(0);
    setLives(lives - 1);
  };

  useEffect(() => {
    if (lives < 1) {
      alert("You lost :(");
      setLives(5);
    }
  }, [lives]);

  useEffect(() => {
    const paddleLimits = getPaddleLimits();
    if (
      topDist >= paddleLimits.top &&
      leftDist >= paddleLimits.left &&
      leftDist <= paddleLimits.right
    ) {
      setVertTrigger(true);
    } else if (topDist > paddleLimits.bottom + 5) {
      substractLife();
    }
    if (topDist <= ballMovement) {
      setVertTrigger(false);
    }
  }, [topDist]);
  useEffect(() => {
    if (leftDist >= 1288) {
      setHoriTrigger(true);
    }
    if (leftDist <= ballMovement) {
      setHoriTrigger(false);
    }
  }, [leftDist]);

  useInterval(() => moveBall(), 30);

  const moveBall = () => {
    if (!vertTrigger) {
      setTopDist(topDist + ballMovement);
      !horiTrigger
        ? setLeftDist(leftDist + ballMovement)
        : setLeftDist(leftDist - ballMovement);
    }
    if (vertTrigger) {
      setTopDist(topDist - ballMovement);
      !horiTrigger
        ? setLeftDist(leftDist + ballMovement)
        : setLeftDist(leftDist - ballMovement);
    }
  };

  const movePaddle = (e) => {
    switch (e.keyCode) {
      case 68:
        paddlePos < 1150 && setPaddlePos(paddlePos + paddleMovement);
        break;
      case 65:
        paddlePos > 0 && setPaddlePos(paddlePos - paddleMovement);
        break;
      default:
        break;
    }
  };

  return (
    <Board onKeyDown={(e) => movePaddle(e)} tabIndex="1">
      <Lives>{lives}</Lives>
      <Ball
        ref={ballRef}
        top={`${topDist.toString()}px`}
        left={`${leftDist.toString()}px`}
      >
        🔴
      </Ball>
      <Paddle ref={paddleRef} left={`${paddlePos.toString()}px`} />
    </Board>
  );
};

const Board = styled.div({
  position: "relative",
  width: "100%",
  height: "100vh",
  overflow: "hidden",
});
const Ball = styled.div({
  margin: "0",
  fontSize: "1em",
  textAlign: "center",
  cursor: "default",
  position: "absolute",
  top: (props) => props.top,
  left: (props) => props.left,
});
const Paddle = styled.div({
  margin: "0",
  width: "12%",
  borderRadius: "2px",
  borderBottomLeftRadius: "16px",
  borderBottomRightRadius: "16px",
  height: "3vh",
  backgroundColor: "black",
  position: "absolute",
  bottom: 0,
  left: (props) => props.left,
});
const Lives = styled.h4({
  margin: "0",
  fontSize: "180px",
  color: "white",
  position: "absolute",
  right: "40px",
  opacity: "0.2",
});

export default Page;
