import React from "react";
import axios from "axios";
import MaterialTable from "material-table";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Style/tooltip.css";
import "../Style/modal.css";

const SearchModalPresenter = ({ rows, handleDeleteIp }) => {
  const [state, setState] = React.useState({
    columns: [
      { title: "IP Address", field: "ipAddr", editable: "never" },
      { title: "Date Added", field: "inputDate", editable: "never" },
      { title: "Memo", field: "memo" },
      { title: "Is Blacklist", field: "isBlack", type: "boolean" }
    ],
    data: rows
  });

  const handleUpdateInsideModal = (ipAddr, memo, isBlack) => {
    var data = { ipAddr: ipAddr, memo: memo, isBlack: isBlack };
    console.log(data);
    axios.put(`http://localhost:3305/:Modal`, { data });
  };

  return (
    <MaterialTable
      title=""
      columns={state.columns}
      data={state.data}
      editable={{
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                setState(prevState => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  handleUpdateInsideModal(
                    newData.ipAddr,
                    newData.memo,
                    newData.isBlack
                  );
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        onRowDelete: oldData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              setState(prevState => {
                const data = [...prevState.data];
                handleDeleteIp(null, data[data.indexOf(oldData)]["ipAddr"]);
                data.splice(data.indexOf(oldData), 1);
                toast.info("successfully delete that row!!");

                return { ...prevState, data };
              });
            }, 600);
          })
      }}
    />
  );
};

export default SearchModalPresenter;
