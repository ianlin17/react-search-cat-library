import "./App.css";
import axios from "axios";
import React, { useState, useCallback } from "react";
import { Backdrop } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { TextField } from "@material-ui/core";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Typing from './Typing';
const _ = require("lodash");
function App() {
  axios.create({
    baseURL: "https://api.thecatapi.com/v1",
    timeout: 1000,
    headers: { "x-api-key": "83f31bfa-8954-498a-bfb2-16d8a9c874cc" },
  });
  const [focused, setFocused] = React.useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  const [searchResult, setSearchResult] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [open, setOpen] = React.useState(false);
  const [oninit, setOnInit] = React.useState(true);
  const [onResult, setOnResult] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [rowData, setRowData] = useState({});
  const [showData, setShowData] = useState([]);
  const _fetchBreeds = (searchValue) =>
    axios.get(`https://api.thecatapi.com/v1/breeds/search?q=${searchValue}`);
  const _fetchImg = (imageId) =>
    axios.get(`https://api.thecatapi.com/v1/images/${imageId}`);
  const columns = [
    {
      field: "imageUrl",
      headerName: "Photo",
      sortable: true,
      width: 75,
      renderCell: (params) => (
        <img alt='cat' className='avatar' src={params.value} />
      ),
    },
    { field: "name", headerName: "Breed", sortable: true, width: 180 },
    { field: "newWeight", headerName: "Weight (kg)", width: 120 },
    {
      field: "alt_names",
      headerName: "Alternative name",
      width: 240,
      sortable: false,
    },
    { field: "life_span", headerName: "Life Span", sortable: true, width: 180 },
    { field: "origin", headerName: "Origin", width: 180, sortable: false },
  ];
  const _fetchData = useCallback(
    _.debounce((_searchVal) => _serchBreed(_searchVal), 1000)
  );
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const _setFakeWeight = (breed) => {
    return { ...breed, weight: { imperial: "N/A" } };
  };
  const _setMissingImg = (breed) => {
    return { ...breed, reference_image_id: "" };
  };
  const _addIndex = (breed, index) => {
    return { ...breed, index: index };
  };
  const handleChange = (word) => {
    setOnResult(false);
    const value = word.target.value.trim();
    setSearchKey(value);
    if (value.length > 2) _fetchData(value);
  };
  const openDialog = (rowData) => {
    const { row } = rowData;
    setRowData(row);
    handleClickOpen();
  };
  const _handleMissingData = (breeds) => {
    for (var i = 0; i < breeds.length; i++) {
      const { weight, reference_image_id } = breeds[i];
      breeds[i] = _addIndex(breeds[i], i);
      if (!weight) breeds[i] = _setFakeWeight(breeds[i]);
      if (!reference_image_id) breeds[i] = _setMissingImg(breeds[i]);
    }
    return breeds;
  };
  const _clearSearch = () => {
    setSearchKey("");
    setShowData([]);
    setSearchResult([]);
    setOnResult(false);
  };
  const _getImage = (breeds) => {
    return breeds.map(async (breed) => {
      const { reference_image_id, weight } = breed;
      const { imperial } = weight;
      if (!reference_image_id) {
        return { ...breed, newWeight: imperial, imageUrl: "missing.png" };
      }
      const url = await _fetchImg(reference_image_id).then(
        (img) => img.data.url
      );
      return { ...breed, newWeight: imperial, imageUrl: url };
    });
  };
  const _serchBreed = async (searchWord) => {
    if (!searchWord) return;
    setSearchResult([]);
    setLoading(true);
    const rawData = await _fetchBreeds(searchWord);
    const handledData = await _handleMissingData(rawData.data);
    const finalData = await _getImage(handledData);
    await Promise.all(finalData).then((breeds) =>
      breeds.forEach((breed) => searchResult.push(breed))
    );
    setShowData(searchResult);
    setOnResult(true);
    setOnInit(false);
    setLoading(false);
  };

  return (
    <div className='App animated-bg-sub'>
      <header className='App-header'>
        <div className="typewriter">
          <h1>Here is the cat library!</h1>
        </div>
        <TextField
          data-testid='search'
          id='breedSearch'
          onFocus={onFocus}
          onBlur={onBlur}
          style={{ display: showData.length > 0 ? "none" : "block" }}
          label={
            focused
              ? (() => Typing())()
              : 'Enter'
          }
          helperText=' '
          placeholder='ex. Abyssinian'
          variant='standard'
          onChange={handleChange}
          value={searchKey}
        />
        <p
          id='errorMsg'
          data-testid='errorMsg'
          style={{
            display:
              !oninit && onResult && showData.length === 0 ? "block" : "none",
          }}>
          No data found with the input: {searchKey}
        </p>
        <div
          id='dataTable'
          style={{ display: showData.length > 0 ? "block" : "none" }}>
          <p data-testid='keyword'>Your key word is: {searchKey} </p>
          <DataGrid
            getRowId={(row) => row.index}
            onRowClick={openDialog}
            rows={showData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
          <Button
            className='Button'
            data-testid='clearBtn'
            variant='contained'
            onClick={_clearSearch}>
            Clear
          </Button>
        </div>
      </header>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <div id='container' className='animated-bg'>
          <h2 id='breed-name'>{rowData.name}</h2>
          <h4
            id='altName'
            style={{ display: rowData.alt_names ? "block" : "none" }}>
            aka {rowData.alt_names}
          </h4>
          <div id='photo-wrap'>
            <img alt='cat' src={rowData.imageUrl} id='photo' />
          </div>
          <Content
            name={"Introduction"}
            content={rowData.description}
            altText={"No introduction of this cat:( "}
          />
          <Content
            name={"Temperament"}
            content={rowData.temperament}
            altText={"We are still working on it :("}
          />
          <Content
            name={"Where am I from"}
            content={rowData.origin}
            altText={"We are still trying to find out :( "}
          />
          <div
            className='content'
            style={{
              display:
                rowData.vcahospitals_url ||
                rowData.wikipedia_url ||
                rowData.vetstreet_url ||
                rowData.cfa_url
                  ? "block"
                  : "none",
            }}>
            <h3>Get to know more about me</h3>
            <div id='reference'>
              <LinkButton
                url={rowData.wikipedia_url}
                name={"Wiki"}
                data-testid='wikiBtn'
              />
              <LinkButton
                url={rowData.vcahospitals_url}
                name={"VCA Hospitals"}
                data-testid='vcaBtn'
              />
              <LinkButton url={rowData.vetstreet_url} name={"Vet Street"} />
              <LinkButton url={rowData.cfa_url} name={"CFA Org"} />
            </div>
          </div>
        </div>
      </Modal>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={handleClose}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </div>
  );
}
export default App;
function LinkButton(_props) {
  return (
    <Button
      className='Button'
      style={{ display: _props.url ? "block" : "none" }}
      variant='contained'
      onClick={() => window.open(_props.url, "_blank", "noopener, noreferrer")}>
      {_props.name}
    </Button>
  );
}
function Content(_props) {
  return (
    <div className='content'>
      <h3>{_props.name}</h3>
      {_props.content ? _props.content : _props.altText}
    </div>
  );
}
