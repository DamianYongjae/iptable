import React, { useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Loader from "../Component/Loader";

export default () => {
  const [inProcessW, setInProcessW] = React.useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        await axios.get("http://localhost:3305/:exportFile", {
          params: { table: "white" }
        });
        setInProcessW(!inProcessW);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [inProcessW, setInProcessW]);

  if (!inProcessW) {
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
      {inProcessW && <Loader />}
      {!inProcessW && <Redirect to="/" />}
    </>
  );
};
