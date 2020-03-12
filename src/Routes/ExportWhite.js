import React, { useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Loader from "../Component/Loader";

export default () => {
  const [inProcess, setInProcess] = React.useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        await axios
          .get(`http://localhost:3305/:exportWhite`)
          .then(setInProcess(!inProcess));
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [inProcess, setInProcess]);

  if (!inProcess) {
    fetch(`http://localhost:3305/downloadWhite`)
      .then(response => {
        response.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = "whitelist.csv";
          a.click();
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  return (
    <>
      {inProcess && <Loader />}
      {!inProcess && <Redirect to="/" />}
    </>
  );
};
