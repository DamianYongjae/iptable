import React from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Button from "../Buttons";
import Input from "../Input";
import useInput from "../../Hooks/useInput";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";

const Wrapper = styled.div`
  width: 100%;
  margin-top: 30px;
  align-items: center;
  text-align: center;
  justify-content: center;
  justify: flex;
`;

const NewTable = styled(Table)`
  justify: flex;
  justify-content: center;
  align-items: center;
`;

const Header = styled(TableHead)`
  background-color: #c7c7cf;
  text-align: center;
`;

const Row = styled(TableRow)`
  text-align: center;
`;

const columns = [
  { id: "ipAddr", label: "IP ADDRESS", minWidth: 170 },
  { id: "inputDate", label: "Date Added", minWidth: 100 }
];

function createData(ipAddr, inputDate) {
  return { ipAddr, inputDate };
}

const rows = [];

const data = [];

const useStyles = makeStyles({
  root: {
    width: "60%"
  },
  container: {
    maxHeight: "80%"
  }
});

const TablePresenter = ({ id, ipAddr, inputDate }) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const input = useInput("");

  function getTime() {
    var tempDate = new Date();
    var date =
      tempDate.getMonth() +
      1 +
      "/" +
      tempDate.getDate() +
      "/" +
      tempDate.getFullYear();
    return date;
  }

  function validateIPAddress(inputText) {
    var ipformat = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

    if (ipformat.test(inputText)) {
      return true;
    }
    return false;
  }

  const onKeyPress = async event => {
    const { which } = event;
    if (which === 13) {
      event.preventDefault();
      try {
        if (validateIPAddress(input.value)) {
          rows.push(createData(input.value, getTime()));
          data.push([input.value]);
          toast.info("enter pressed. INPUT VALUE: " + input.value);
          input.setValue("");
        } else {
          toast.error("please input appropriate ip address format");
        }
      } catch {
        toast.error("error occurred");
      }
    }
  };

  return (
    <>
      <Input
        value={input.value}
        onChange={input.onChange}
        placeholder="ex) 192.168.1.1"
        onKeyPress={onKeyPress}
      />
      <CSVLink data={data} filename={"list.csv"} enclosingCharacter={""}>
        <Button text={"export"}></Button>
      </CSVLink>

      <Button text={"import"} />
      <Paper className={classes.root}>
        <Wrapper>
          <TableContainer className={classes.container}>
            <NewTable stickyHeader aria-label="sticky table">
              <Header>
                <Row>
                  {columns.map(column => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </Row>
              </Header>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(row => {
                    return (
                      <Row hover role="checkbox" tabIndex={-1} key={row.code}>
                        {columns.map(column => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </Row>
                    );
                  })}
              </TableBody>
            </NewTable>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Wrapper>
      </Paper>
    </>
  );
};

export default TablePresenter;
