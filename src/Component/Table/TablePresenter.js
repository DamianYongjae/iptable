import React from "react";
import axios from "axios";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import BlockIcon from "@material-ui/icons/Block";
import InfoIcon from "@material-ui/icons/Info";
import ListAltIcon from "@material-ui/icons/ListAlt";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import AddCommentIcon from "@material-ui/icons/AddComment";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  Container,
  Checkbox,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse
} from "@material-ui/core";
import Button from "../Buttons";
import Input from "../Input";
import useInput from "../../Hooks/useInput";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import { Tooltip as ButtonTooltip } from "@material-ui/core";
import { Tooltip, Overlay, Modal } from "react-bootstrap";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import SearchModalPresenter from "./SearchModalPresenter";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Style/tooltip.css";
import "../Style/table.css";

const Wrapper = styled.div`
  width: 100%;
  margin-top: 30px;
  align-items: center;
  text-align: center;
  justify-content: center;
  justify: flex;
`;

const Header = styled(EnhancedTableHead)`
  background-color: #c7c7cf;
  text-align: center;
`;

const Row = styled(TableRow)`
  text-align: left;
`;

const TooltipButton = styled(Button)`
  padding: 0;
  width: 20px;
  height: 20px;
  background-color: #c7c7cf;
  color: black;
`;

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    textAlign: "center"
  },
  nav: {
    textAlign: "center"
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0,0,0,0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  },
  form: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: "fit-content"
  }
}));

var addMemoTargetIp;
var answer = { ip: "", country_name: "", state_prov: "", city: "", isp: "" };
var deleteTarget;
var result = "";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

const TablePresenter = ({
  classes,
  columns,
  rows,
  exportData,
  rowBlack,
  rowWhite,
  exportBlackData,
  exportWhiteData,
  createData,
  getTime,
  validateIPAddress,
  includeIP,
  ipgeolocationApi,
  separateTable
}) => {
  const [openAll, setOpenAll] = React.useState(false);
  const [openBlack, setOpenBlack] = React.useState(false);
  const [openMemo, setOpenMemo] = React.useState(false);
  const [openWhite, setOpenWhite] = React.useState(false);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [searchModal, setSearchModal] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const input = useInput("");
  const inputMemo = useInput("");
  const isSelected = name => selected.indexOf(name) !== -1;
  const target = React.useRef(null);

  var createdData;

  classes = useStyles();

  const refreshTables = () => {
    rowBlack = [];
    rowWhite = [];
    exportBlackData = [];
    exportWhiteData = [];

    separateTable();
  };

  function handleResponse(json) {
    answer = json;
    handleShowOverlay(answer["ip"]);
  }

  const getIpInfoByClick = ip => {
    var GeolocationParams = require("ip-geolocation-api-javascript-sdk/GeolocationParams.js");

    var geolocationParams = new GeolocationParams();
    geolocationParams.setIPAddress(ip);
    geolocationParams.setLang("en");
    geolocationParams.setFields("country_name,state_prov,city,isp");

    ipgeolocationApi.getGeolocation(handleResponse, geolocationParams);
  };

  const handleAllClick = () => {
    setOpenAll(!openAll);
  };

  const handleBlackClick = () => {
    setOpenBlack(!openBlack);
  };

  const handleWhiteClick = () => {
    setOpenWhite(!openWhite);
  };

  const handleSearchModelClose = () => {
    refreshTables();
    setSearchModal(!searchModal);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.ipAddr);
      deleteTarget = newSelecteds;
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    return newSelected;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function closeOverlay() {
    setShow(false);
  }

  const handleClickAddMemo = ip => {
    addMemoTargetIp = ip;
    setOpenMemo(true);
  };

  const handleMemoModalClose = () => {
    refreshTables();
    setOpenMemo(false);
  };

  function handleShowOverlay(ip) {
    result =
      "IP: " +
      ip +
      "\n" +
      " Country: " +
      answer["country_name"] +
      "\n" +
      " State: " +
      answer["state_prov"] +
      "\n" +
      " City: " +
      answer["city"] +
      "\n" +
      " ISP: " +
      answer["isp"];
    setShow(true);
  }

  const handleAddNewIp = event => {
    var data = createdData;

    axios.post(`http://localhost:3305`, data);
  };

  const handleDeleteIp = (event, data) => {
    axios.delete(`http://localhost:3305`, { params: { data } });
  };

  const handleAddMemo = (event, ip, memo) => {
    var data = { ipAddr: ip, memo: memo };

    axios.put(`http://localhost:3305`, { data });
    window.location.reload();
  };

  const addIpToTable = () => {
    if (validateIPAddress(input.value)) {
      if (!includeIP(exportData, input.value)) {
        exportData.push([input.value]);
        createdData = createData(input.value, getTime());
        rows.push(createdData);
        rowBlack.push(createdData);
        exportBlackData.push([input.value]);
        toast.info("enter pressed. INPUT VALUE: " + input.value);
      } else {
        toast.error("duplicated ip address");
      }
    } else {
      toast.error("please input appropriate ip address format");
    }
    input.setValue("");
    handleAddNewIp();
  };

  const deleteIpFromTable = event => {
    deleteTarget.forEach(element => {
      for (var i = 0; i < exportData.length; i++) {
        if (exportData[i][0] === element) {
          exportData.splice(i, 1);
          rows.splice(i, 1);
          handleClick(event, element);
          handleDeleteIp(event, element);
          toast.info("selected Ip addresses are deleted!");
        }
      }
      setSelected([]);
      refreshTables();
    });
  };

  const onKeyPress = async event => {
    const { which } = event;
    if (which === 13) {
      event.preventDefault();
      try {
        addIpToTable();
      } catch {
        toast.error("error occurred while adding");
      }
    }
  };

  const onDeleteClick = async event => {
    try {
      deleteIpFromTable(event);
    } catch {
      toast.error("error occurred while deleting");
    }
  };

  return (
    <>
      <Overlay
        key={"key"}
        target={target.current}
        show={show}
        placement="right"
      >
        {props => (
          <Tooltip id="overlay-example" theme="light" {...props}>
            <div style={{ textAlign: "right" }}>
              <TooltipButton onClick={closeOverlay} text={"x"}></TooltipButton>
            </div>
            {result.split("\n").map((i, key) => {
              return (
                <div>
                  <div key={key}>{i}</div>
                </div>
              );
            })}
          </Tooltip>
        )}
      </Overlay>
      <Modal
        size="lg"
        show={searchModal}
        onHide={() => {
          handleSearchModelClose();
        }}
        onExited={() => {
          window.location.reload();
        }}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SearchModalPresenter
            answer={answer}
            classes={classes}
            rows={rows}
            exportData={exportData}
            ipgeolocationApi={ipgeolocationApi}
            createData={createData}
            getTime={getTime}
            validateIPAddress={validateIPAddress}
            includeIP={includeIP}
            handleDeleteIp={handleDeleteIp}
          />
        </Modal.Body>
      </Modal>
      <Dialog
        id={addMemoTargetIp}
        open={openMemo}
        onClose={handleMemoModalClose}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle id="form-dialog-title">Add Memo</DialogTitle>
        <DialogContent>
          <DialogContentText>Please add memo for ip</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id={addMemoTargetIp}
            label="Memo"
            type="text"
            value={inputMemo.value}
            onChange={inputMemo.onChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMemoModalClose} text={"Cancel"} />

          <Button
            onClick={event => {
              handleAddMemo(event, addMemoTargetIp, inputMemo.value);
              handleMemoModalClose();
            }}
            text={"OK"}
          />
        </DialogActions>
      </Dialog>

      <Wrapper>
        <Input
          value={input.value}
          onChange={input.onChange}
          placeholder="ex) 192.168.1.1"
          onKeyPress={onKeyPress}
        />

        <Button text={"import"} />

        <Button text={"search"} onClick={() => setSearchModal(true)} />
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          className={classes.root}
        >
          <ListItem button onClick={handleAllClick}>
            <ListItemIcon>
              <ListAltIcon />
            </ListItemIcon>
            <ListItemText primary="View All List" />
            {openAll ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openAll} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem className={classes.nested}>
                <Container style={{ width: "85%" }}>
                  <Paper className={classes.root}>
                    <Wrapper>
                      <span>
                        <EnhancedTableToolbar
                          numSelected={selected.length}
                          onDeleteClick={onDeleteClick}
                        />
                      </span>
                      <TableContainer className={classes.container}>
                        <Table stickyHeader aria-label="sticky table">
                          <Header
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                          />

                          <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((row, index) => {
                                const isItemSelected = isSelected(row.ipAddr);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                  <Row
                                    hover
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.ipAddr}
                                    selected={isItemSelected}
                                  >
                                    <TableCell padding="checkbox">
                                      <Checkbox
                                        onClick={event => {
                                          deleteTarget = handleClick(
                                            event,
                                            row.ipAddr
                                          );
                                        }}
                                        checked={isItemSelected}
                                        inputProps={{
                                          "aria-labelledby": labelId
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell
                                      component="th"
                                      id={labelId}
                                      scope="row"
                                      padding="none"
                                    >
                                      {row.ipAddr}
                                      <ButtonTooltip title="IP INFO">
                                        <IconButton
                                          aria-label="info"
                                          style={{
                                            outline: "none",
                                            color: "#3897f0"
                                          }}
                                          onClick={() => {
                                            getIpInfoByClick(row["ipAddr"]);
                                          }}
                                        >
                                          <InfoIcon />
                                        </IconButton>
                                      </ButtonTooltip>
                                    </TableCell>
                                    <TableCell align="left" size="small">
                                      {row.inputDate}
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      padding="none"
                                      size="medium"
                                    >
                                      {row.memo === null || row.memo === "" ? (
                                        <>
                                          <IconButton
                                            aria-label="info"
                                            style={{
                                              outline: "none",
                                              color: "#3897f0"
                                            }}
                                            onClick={() => {
                                              handleClickAddMemo(row.ipAddr);
                                            }}
                                          >
                                            <AddCommentIcon />
                                          </IconButton>
                                        </>
                                      ) : (
                                        row.memo
                                      )}
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      padding="checkbox"
                                    >
                                      {row.isBlack === 1 ? (
                                        <ButtonTooltip
                                          title="Black list"
                                          aria-label="info"
                                        >
                                          <BlockIcon />
                                        </ButtonTooltip>
                                      ) : (
                                        <ButtonTooltip
                                          title="White list"
                                          aria-label="info"
                                        >
                                          <LockOpenIcon />
                                        </ButtonTooltip>
                                      )}
                                    </TableCell>
                                  </Row>
                                );
                              })}
                          </TableBody>
                        </Table>
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
                </Container>
              </ListItem>
            </List>
          </Collapse>
          <ListItem button onClick={handleBlackClick}>
            <ListItemIcon>
              <BlockIcon />
            </ListItemIcon>
            <ListItemText primary="Black List" />
            {openBlack ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openBlack} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem className={classes.nested}>
                <Container style={{ width: "85%" }}>
                  <Paper className={classes.root}>
                    <TableContainer className={classes.container}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {columns.map(column => (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                              >
                                {column.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rowBlack
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map(row => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={row.ipAddr}
                                >
                                  {columns.map(column => {
                                    const value = row[column.id];
                                    return (
                                      <TableCell
                                        key={column.id}
                                        align={column.align}
                                      >
                                        {column.format &&
                                        typeof value === "number"
                                          ? column.format(value)
                                          : value}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                      <div style={{ paddingTop: "10px", textAlign: "left" }}>
                        <CSVLink
                          data={exportBlackData}
                          filename={"blacklist.csv"}
                        >
                          <Button text={"export"}></Button>
                        </CSVLink>
                      </div>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[10, 25, 100]}
                      component="div"
                      count={rowBlack.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                  </Paper>
                </Container>
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={handleWhiteClick}>
            <ListItemIcon>
              <LockOpenIcon />
            </ListItemIcon>
            <ListItemText primary="White List" />
            {openWhite ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openWhite} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem className={classes.nested}>
                <Container style={{ width: "85%" }}>
                  <Paper className={classes.root}>
                    <TableContainer className={classes.container}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {columns.map(column => (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                              >
                                {column.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rowWhite
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map(row => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={row.ipAddr}
                                >
                                  {columns.map(column => {
                                    const value = row[column.id];
                                    return (
                                      <TableCell
                                        key={column.id}
                                        align={column.align}
                                      >
                                        {column.format &&
                                        typeof value === "number"
                                          ? column.format(value)
                                          : value}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                      <div style={{ paddingTop: "10px", textAlign: "left" }}>
                        <CSVLink
                          data={exportWhiteData}
                          filename={"whitelist.csv"}
                        >
                          <Button text={"export"}></Button>
                        </CSVLink>
                      </div>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[10, 25, 100]}
                      component="div"
                      count={rowWhite.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                  </Paper>
                </Container>
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Wrapper>
    </>
  );
};

export default TablePresenter;
