import React, {useState} from "react";
import { IonPage, IonGrid, IonRow, IonCol, IonContent, IonButton } from '@ionic/react';
import { RouteComponentProps } from "react-router-dom";
import SudokoData from "./Sudoko.json";
import './Puzzle.css';
import sudoku_class from './sudoku_script.js';

/* Storage Plugin */
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

interface PuzzleProps extends RouteComponentProps<{
  type_level: string;
}> {}

const Puzzle: React.FC<PuzzleProps> = ({match}) => {
	
	var [gametype,gamelevel] = match.params.type_level.split("_");
	var [gametype_row,gametype_col] = gametype.split("x");
	console.log("storage Matter");
	var SudokuJsData:any;
	getItem("game").then(function(result){
		if(result.value != null && result.value != "" && result.value != ''){
			console.log("coming in");
			console.log(result.value);
			SudokuJsData = JSON.parse(result.value);
			
			console.log(SudokuJsData);
		} else {
			console.log("coming out");
			
		}
	});
	console.log("after this");
	console.log(SudokuJsData);
	var sudokuGrid = new sudoku_class();
	sudokuGrid.setSize(parseInt(gametype_row),parseInt(gametype_col));
	//sudokuGrid.setSize(2,3);
	gamelevel = "1";

	sudokuGrid.generateGrid();
	sudokuGrid.giveAProblem(0);
	//var result=sudokuGrid.printArr();
	SudokuJsData = JSON.parse(sudokuGrid.genJson());
	Storage.set({
			key: "game",
			value: JSON.stringify(SudokuJsData)
		});
	function getItem(keyname: string) {
		return Storage.get({ key: keyname });
	}
  	const td_width = 32;
	console.log(SudokuJsData[0].data);
	const [origDataValues,setOrigDataValues] = useState(SudokuJsData[0].data)
	const [dataValues,setDataValues] = useState(SudokuJsData[0].data.map((eachrow: any) => {
		return eachrow.rowData.map((eachdata:any,index:any) => {
			if(eachrow.hiddenPos.indexOf(index)!==-1)
			return "";
			else
			return ""+eachdata+"";
		})
	}))
	const [hiddenValues,setHiddenValues] = useState([])
	const tableWidth = SudokuJsData[0].data[0].rowData.length*td_width+2;
	const rowLength = SudokuJsData[0].data[0].rowData.length;
	const numbersArray = [];
	for(var n=1;n<=rowLength;n++){
		numbersArray.push(n);
	}
	const [selectedBox,setSelectedBox] = useState("");
	const [errorBox,setErrorBox] = useState("");
	const [errorArray,setErrorArray] = useState([""]);
	const selectBox=function(rIndex: number,cIndex: number){
		const hiddenPosArray = SudokuJsData[0].data[rIndex].hiddenPos;
		if(hiddenPosArray.indexOf(cIndex)!==-1){
			setSelectedBox(rIndex+"-"+cIndex);
		}
	}
	const data_display=dataValues.map((eachrow: any,rowIndex: any) => {
		const each_row_values = eachrow.map((eachval: any,colIndex: any) => {
		const hiddenPosArray = SudokuJsData[0].data[rowIndex].hiddenPos;
		var preFilledCell=1;
		if(hiddenPosArray.indexOf(colIndex)!==-1){
			preFilledCell=0;
		}
		return <IonCol style={{fontWeight:preFilledCell?"bold":"normal",backgroundColor: errorArray.indexOf(rowIndex+"-"+colIndex) !== -1 ? "red" : selectedBox === rowIndex+"-"+colIndex ? "lightblue" : "transparent"  }} onClick={ () => selectBox(rowIndex,colIndex) } id={rowIndex+"-"+colIndex} key={colIndex}>
			{eachval}
			</IonCol>
		})
		return <IonRow key={rowIndex}>{each_row_values}</IonRow>
	});

	function updateNumber(val: string){
		if(selectedBox!==""){
			const [rIndex,cIndex] = selectedBox.split("-");
			setDataValues((prevState: any) =>{
				const updatedDataValues=prevState.map((eachrow: any,rowVal: any) => {
					const rowValCompare = ""+rowVal;
					if(rowValCompare === rIndex) {
						return eachrow.map((eachcol: any,colVal: any) => {
							const colValCompare = ""+colVal;
							if(colValCompare == cIndex) {
								return val;
							}
							else{
								return eachcol;
							}
						})
					}
					else{
						return eachrow;
					}
				})
				//const updatedDataValues = prevState.map(eachrow => eachrow);
				//updatedDataValues[parseInt(rIndex)].rowData[parseInt(cIndex)] = val;
				return updatedDataValues;
			});
			checkIfCorrect(parseInt(rIndex),parseInt(cIndex),val);			
		}
		else{
			alert("Please select a box to fill.");
		}
	}

	function checkIfCorrect(rIndex: number,cIndex: number,numberval: string){
		/*setErrorBox("");
		if(origDataValues[rIndex].rowData[cIndex] !== numberval) { // directly checks the solutions array
			setErrorBox(rIndex+"-"+cIndex);
		}*/
		const errArray = [];

		if(numberval!=""){
			for(var r=0;r<rowLength;r++){
				console.log("row values "+dataValues[r][cIndex])
				if(r !== rIndex && dataValues[r][cIndex] === numberval) {
					errArray.push(r+"-"+cIndex);
				}
			}	
			for(var c=0;c<rowLength;c++){
				console.log("row values "+dataValues[rIndex][c])
				if(c !== cIndex && dataValues[rIndex][c] === numberval) {
					errArray.push(rIndex+"-"+c);
				}
			}	
			if(errArray.length>0){
				errArray.push(rIndex+"-"+cIndex);
			}
		}
		setErrorArray(errArray);
	}

	function clearGridValue(){
		if(selectedBox!==""){
			var [rIndex,cIndex] = selectedBox.split("-");
			const hiddenPosArray = SudokuJsData[0].data[parseInt(rIndex)].hiddenPos;
			if(hiddenPosArray.indexOf(parseInt(cIndex))!==-1){
				updateNumber("")
			}
		}
		else{
			alert("Please select a cell to clear.")
		}
	}

	function hintDisplay(){
		getItem("hints").then(function(result){
			if(result.value==="enabled"){
				alert("Hints Shown");
			}
			else{
				alert("Please enable hints in settings.");
			}
		});
	}

	return(
		<IonPage>

      <IonContent>

			<div style={{textAlign:"center",paddingTop:"75px"}}>
				<IonGrid>
					{data_display}
				</IonGrid>
				<div className="options_div">
					<IonButton color="warning" onClick={clearGridValue} size="small">Clear</IonButton>
					<IonButton color="warning" onClick={hintDisplay} size="small">Hint</IonButton>
				</div>
				<div className="numbers_div">
					{numbersArray.map(val => <div key={val} onClick={()=>updateNumber(""+val+"")} className="eachnumber_div">{val}</div>)}
				</div>
			</div>
		</IonContent>
		</IonPage>
	)
}

export default Puzzle