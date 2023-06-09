import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Column } from "@ant-design/plots";
import "./style.css";

const Home = () => {
  const data = [
    {
      name: "London",
      title: "Jan.",
      value: 18.9,
    },
    {
      name: "London",
      title: "Feb.",
      value: 28.8,
    },
    {
      name: "London",
      title: "Mar.",
      value: 39.3,
    },
    {
      name: "London",
      title: "Apr.",
      value: 81.4,
    },
    {
      name: "London",
      title: "May",
      value: 47,
    },
    {
      name: "London",
      title: "Jun.",
      value: 20.3,
    },
    {
      name: "London",
      title: "Jul.",
      value: 24,
    },
    {
      name: "London",
      title: "Aug.",
      value: 35.6,
    },
    {
      name: "Berlin",
      title: "Jan.",
      value: 12.4,
    },
    {
      name: "Berlin",
      title: "Feb.",
      value: 23.2,
    },
    {
      name: "Berlin",
      title: "Mar.",
      value: 34.5,
    },
    {
      name: "Berlin",
      title: "Apr.",
      value: 99.7,
    },
    {
      name: "Berlin",
      title: "May",
      value: 52.6,
    },
    {
      name: "Berlin",
      title: "Jun.",
      value: 35.5,
    },
    {
      name: "Berlin",
      title: "Jul.",
      value: 37.4,
    },
    {
      name: "Berlin",
      title: "Aug.",
      value: 42.4,
    },
  ];
  const config = {
    data,
    isGroup: true,
    xField: "title",
    yField: "value",
    seriesField: "name",
    label: {
      position: "middle",
      layout: [
        {
          type: "interval-adjust-position",
        },
        {
          type: "interval-hide-overlap",
        },
        {
          type: "adjust-color",
        },
      ],
    },
  };
  return (
    <div className="gx-main-content-wrapper">
      <Column {...config} />
    </div>
  );
};
export default Home;
