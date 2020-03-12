import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Loader from "../Component/Loader";

export default () => {
  const [inProcess, setInProcess] = React.useState(true);

  const getData = async () => {
    try {
      await axios.get(`http://localhost:3305/:exportFile`, {
        params: { table: "black" }
      });
      setInProcess(!inProcess);
    } catch (error) {
      console.log(error);
    }
  };

  getData();

  if (!inProcess) {
    fetch(`http://localhost:3305/downloadBlack`)
      .then(response => {
        response.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = "blacklist.csv";
          a.click();
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  return <>{inProcess ? <Loader /> : <Redirect to="/" />}</>;
};
