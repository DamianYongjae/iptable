import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import { Toolbar, Typography, IconButton } from "@material-ui/core";

import { Tooltip as DeleteTooltip } from "@material-ui/core";

import { Tooltip } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Style/tooltip.css";
import "../Style/table.css";

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: "1 1 100%"
  }
}));

const EnhancedTableToolbar = ({ numSelected, onDeleteClick }) => {
  const classes = useToolbarStyles();

  return (
    <>
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0
        })}
      >
        {numSelected > 0 ? (
          <Typography
            className={classes.title}
            color="inherit"
            variant="subtitle1"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography className={classes.title} variant="h6" id="tableTitle">
            BlackList IP Addresses
          </Typography>
        )}

        {numSelected > 0 ? (
          <DeleteTooltip title="Delete">
            <IconButton
              aria-label="delete"
              style={{ outline: "none" }}
              onClick={onDeleteClick}
            >
              <DeleteIcon />
            </IconButton>
          </DeleteTooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

export default EnhancedTableToolbar;
