import React, { useState, useRef, useEffect } from "react"
import PropTypes from "prop-types"

import "../global.css"

import {
  Typography,
  Container,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  TablePagination,
  TableFooter,
  IconButton,
} from "@material-ui/core"
import FirstPageIcon from "@material-ui/icons/FirstPage"
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft"
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight"
import LastPageIcon from "@material-ui/icons/LastPage"
import { makeStyles, useTheme } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  diceRollInformation: {
    marginBottom: theme.spacing(3),
  },
}))

const useStylesPagination = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}))

const TablePaginationActions = props => {
  const classes = useStylesPagination()
  const theme = useTheme()
  const { count, page, rowsPerPage, onChangePage } = props
  const handleFirstPageButtonClick = event => {
    onChangePage(event, 0)
  }

  const handleBackButtonClick = event => {
    onChangePage(event, page - 1)
  }

  const handleNextButtonClick = event => {
    onChangePage(event, page + 1)
  }

  const handleLastPageButtonClick = event => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  )
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
}

const Home = () => {
  const [diceRolls, setDiceRolls] = useState([])
  const [rolled, setRolled] = useState(false)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, diceRolls.length - page * rowsPerPage)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const diceRollsTotal = useRef()
  const diceType = useRef()

  const handleRoll = e => {
    e.preventDefault()
    setRolled(true)
    let rolls = []
    for (let i = 1; i <= parseInt(diceRollsTotal.current.value); i++) {
      rolls.push({
        rollNumber: i,
        roll: parseInt(
          Math.random() * parseInt(diceType.current.value.slice(1)) + 1
        ),
      })
    }
    setDiceRolls(rolls)
  }

  const classes = useStyles()
  return (
    <Container maxWidth="xs">
      <Typography variant="h1">Dice roll</Typography>

      <form className={classes.form} noValidate onSubmit={handleRoll}>
        <TextField
          id="dice-roll-total"
          label="How many dice to roll? (1-100)"
          margin="normal"
          variant="outlined"
          fullWidth
          type="number"
          inputRef={diceRollsTotal}
          onChange={() => setRolled(false)}
          required
          defaultValue={1}
        />
        <TextField
          id="dice-type"
          label="Dice type"
          variant="outlined"
          margin="normal"
          select
          fullWidth
          inputRef={diceType}
          onChange={() => setRolled(false)}
          defaultValue="d6"
        >
          <MenuItem value="d4">d4</MenuItem>
          <MenuItem value="d6">d6</MenuItem>
          <MenuItem value="d8">d8</MenuItem>
          <MenuItem value="d10">d10</MenuItem>
          <MenuItem value="d12">d12</MenuItem>
          <MenuItem value="d20">d20</MenuItem>
        </TextField>

        <Button
          className={classes.submit}
          type="submit"
          variant="contained"
          color="primary"
        >
          Roll dice!
        </Button>
      </form>
      {rolled && diceRolls.length > 0 && (
        <>
          <div className={classes.diceRollInformation}>
            <Typography>
              Total dice rolled: {diceRollsTotal.current.value}
            </Typography>
            <Typography>Dice type rolled: {diceType.current.value}</Typography>
          </div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Roll number</TableCell>
                  <TableCell>Roll</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? diceRolls.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : diceRolls
                ).map(roll => (
                  <TableRow key={roll.rollNumber}>
                    <TableCell component="th" scope="row">
                      {roll.rollNumber}
                    </TableCell>
                    <TableCell>{roll.roll}</TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={3}
                    count={diceRolls.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { "aria-label": "rows per page" },
                      native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  )
}

export default Home
