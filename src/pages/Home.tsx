import { IonHeader, IonToolbar, IonTitle, IonImg, IonButtons, IonContent, IonPage, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonItemDivider, IonToggle, IonGrid, IonRow, IonCol, IonText, IonRange,IonList,IonPopover,IonIcon} from '@ionic/react';
import React, {useState, useEffect} from 'react';
import { RangeValue } from '@ionic/core';
import './Home.css';
import {timerCal,clearTimer} from "./timer.js";
/* Icons & Images */
import homeIcon from "./images/home-outline.svg";
import settingsIcon from "./images/settings-outline.svg";
import stopwatchico from "./images/stopwatch.svg";

/* Data Imports */
import GameTypes from "./data/game_types.json";
import sudoku_class from './sudoku_script.js';

/* Storage Plugin */
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
var sec=0;
	var clearIntervalFlag:any=false;
/*export const RangeExamples: React.FC = () => {

  const [value, setValue] = useState(0);
  const [rangeValue, setRangeValue] = useState<{
    lower: number;
    upper: number;
  }>({ lower: 0, upper: 0 });*/
const Home: React.FC = () => { 

  /* ******** COMMON VARIABLES & FUNCTIONS *************** */
  const [displayPage,setDisplayPage] = useState("pagediv_home");
  var timerG=0;
  useEffect(() => { // onload of the page this will be executed
    getItem("hints").then(function(result){
      setHintsOption(result.value==="enabled" ? true : false);
    });
    getItem("show_errors").then(function(result){
      setShowErrorsOption(result.value==="enabled" ? true : false);
    });
	getItem("autocheck").then(function(result){
      setShowAutoCheckMistakes(result.value==="enabled" ? true : false);
    });
	getItem("mistakesCheck").then(function(result){
      setmistakesCheck(result.value==="enabled" ? true : false);
    });
	getItem("mistakesCount").then(function(result){
		//var resultval:string = result.value;
      setMistakesCount(result.value !== null ? parseInt(result.value) : 3);
    });

  getItem("statisticsData").then(function(result){
      console.log("ls statistics : "+result.value)
      if(result.value!==null)
      {
        var result_array=JSON.parse(result.value);
        console.log(result_array.length)
        console.log(result_array[0].gameType)
        setStatisticsData(result_array);
        //result_array.shift();
        if(result_array.length>0)
        {
          //var newresult_array=result_array.map(val => console.log(val))
          //setStatisticsData(newresult_array);
        }
      }
    });

  },[]);

  /* ********* HOME PAGE SECTION ************* */
  const [gameType,setGameType] = useState("");
  const initialGameLevelsArray : string[] = [];
  const [gameLevelsArray,setGameLevelsArray] = useState(initialGameLevelsArray);
  const [gameResult,setGameResult] = useState("");
  //const setActiveListArr : string[] = [];

  const [gameLevel,setGameLevel] = useState("");

 
  
  function gameTypeSelected(val: string){
    if(val!==""){
        setGameType(val); 
        //setGameLevel("0"); 
        const gametype_levels_array=GameTypes[0].game_types.filter(gametype => gametype.gametype_name === val);
        setGameLevelsArray(gametype_levels_array[0].gametype_levels);
    }
    else{
      setGameType(val); 
      setGameLevel(""); 
      setGameLevelsArray([]);
    }
  }
  function gamelevelSelected(val: string){
	   /*if(val === "Easy"){
		   setGameLevel("1");
	   } else if(val === "Intermediate"){
		   setGameLevel("2");
	   } else if(val === "Expert"){
		   setGameLevel("3");
	   }*/
	   setGameLevel(val);
  }
  function showRange(timer:boolean){
	  if(timer){
			setShowPopover(true);
			sec = timerUser*60;
		}
		 
  }
  function setTimerGame(value:number){
	sec = value*60;
	setTimerUser(value);
  }
  function start_game(timer:boolean){
    if(gameType===""){
      alert("Please select a game type");
      return;
    }
    if(gameLevelsArray.length>0 && gameLevel===""){
      alert("Please select a game level");
      return;
    }
	
	reset(timer);
	if(timer){
		
		setShowPopover(false);
	}
	game_reset();
    puzzle_page_display();
	
	//reset(timer);
  }
  function gameover_goto(pageval:string){
    //reset values
    game_reset();  
    //open page
    setDisplayPage(pageval)
  }
  function game_reset(){
    setGameResult("")
    setOrigDataValues([{"rowData":[],"hiddenPos":[]}]);
    setDataValues([]);
    setHiddenValues([]);
    setNumbersArray([{numberval:0,numbercount:0}]);
    setRowLength(0);
    setSelectedBox("");
    setErrorBox("");
    setErrorArray([""]);
    setActiveList([""]);
  }
  const game_types_display = GameTypes[0].game_types.map(val => <IonSelectOption value={val.gametype_name}>{val.gametype_name}</IonSelectOption> );
  const game_levels_display = gameLevelsArray.map(val => <IonSelectOption value={val}>{val}</IonSelectOption>);

  /* ********* PUZZLE PAGE SECTION ************* */

  var sudokuGrid;
  var SudokuJsData:any[] = [];
  const [origDataValues,setOrigDataValues] = useState([{"rowData":[],"hiddenPos":[]}]);
  const [dataValues,setDataValues] = useState([]);
  const [hiddenValues,setHiddenValues] = useState([])
  const [numbersArray, setNumbersArray] = useState([{numberval:0,numbercount:0}])
  const [rowLength,setRowLength] = useState(0);
  const [selectedBox,setSelectedBox] = useState("");
  const [errorBox,setErrorBox] = useState("");
  const [errorArray,setErrorArray] = useState([""]);
  const [ActiveList,setActiveList] = useState([""]);
  const [undoArray, setUndoArray] = useState([{row:0,col:0,curValue:"",preValue:""}]);
  function reset(timer:boolean){
	 
	 if(clearIntervalFlag){
		  clearInterval(clearIntervalFlag);
		  if(!timer){
		  sec=0;
		  timerCal(0,0, 0,document.getElementById('timerDiv'));
		  }
	 }
	
	 var min=0;
	var hr=0;
	 clearIntervalFlag = setInterval(function() {
		if(!timer){
			sec=sec+1;
		} else {
		 sec=sec-1;
		}
		min = Math.floor(sec/60);
		hr = Math.floor(min/60);
		 timerCal(sec%60,min, hr,document.getElementById('timerDiv'));
	 },1000);
	
  }
  function puzzle_page_display(){
    setSelectedBox("");
	setUndoArray([{row:0,col:0,curValue:"",preValue:""}]);
	const [gametype_row,gametype_col] = gameType.split("x");
    sudokuGrid = new sudoku_class();
    sudokuGrid.setSize(parseInt(gametype_row),parseInt(gametype_col));
    sudokuGrid.generateGrid();
    
    var puzzle_gamelevel="1";
    if(gameLevel === "Easy"){
      puzzle_gamelevel="1";
    } else if(gameLevel === "Intermediate"){
      puzzle_gamelevel="2";
    } else if(gameLevel === "Expert"){
      puzzle_gamelevel="3";
    }
    sudokuGrid.giveAProblem(parseInt(puzzle_gamelevel));
	
    var result=sudokuGrid.printArr();// not used
    SudokuJsData = JSON.parse(sudokuGrid.genJson());
    console.log(SudokuJsData);
    setOrigDataValues(SudokuJsData[0].data); // full original data is added here
  
    var tempNumbersArray = [{numberval:0,numbercount:0}];  
    SudokuJsData[0].data.map((eachrow:any,rowIndex:any) => {
      tempNumbersArray.push({numberval:rowIndex+1,numbercount:0});
    });
  
  	setDataValues(SudokuJsData[0].data.map((eachrow: any) => {
      return eachrow.rowData.map((eachdata:any,index:any) => {
        if(eachrow.hiddenPos.indexOf(index)!==-1)
        {
          tempNumbersArray[0].numbercount=tempNumbersArray[0].numbercount+1;
          return "";
        }
        else
        {
          tempNumbersArray[eachdata].numbercount=tempNumbersArray[eachdata].numbercount+1;
          return ""+eachdata+"";
        }
      })
    }));
    setNumbersArray(tempNumbersArray);
  
    setRowLength(SudokuJsData[0].data[0].rowData.length);
    setDisplayPage("pagediv_puzzle")
  }
 
  const selectBox=function(rIndex: number,cIndex: number){
	  const hiddenPosArray: number[] = origDataValues[rIndex].hiddenPos;
    if(hiddenPosArray.indexOf(cIndex)!==-1){
		
      setSelectedBox(rIndex+"-"+cIndex);
	  highlightSelected(rIndex,cIndex,true);
    }
  }
	function highlightSelected(rIndex: number,cIndex: number,clear:boolean){
		var ActArray = [];

		for(var r=0;r<rowLength;r++){
			ActArray.push(r+"-"+cIndex);
		} 
		for(var c=0;c<rowLength;c++){
				ActArray.push(rIndex+"-"+c);
		}

		/*Grid validate*/
		var gridrow =0;
		var gridcolumn = 0;
		const [gametype_row_stringval,gametype_col_stringval] = gameType.split("x");
		const gametype_row = parseInt(gametype_row_stringval);
		const gametype_col = parseInt(gametype_col_stringval);
		if(rIndex< gametype_row){
			gridrow = 0;
		} else{
			const temp = rIndex;
			gridrow = Math.floor(temp/gametype_row);
		}
		if(cIndex< gametype_col){
			gridcolumn = 0;
		} else{
			gridcolumn = Math.floor(cIndex/gametype_col);
		}

		var startrow = (gametype_row * gridrow);
		var startcol = (gametype_col * gridcolumn);

		for(var i = startrow; i<startrow+gametype_row;i++){
		for(var j = startcol; j<startcol+gametype_col;j++){
			ActArray.push(i+"-"+j);
		 }
		}
		setActiveList(ActArray);
	}
  const data_display=dataValues.length > 0 ? dataValues.map((eachrow: any,rowIndex: any) => {
    const each_row_values = eachrow.map((eachval: any,colIndex: any) => {
    const hiddenPosArray: number[] = origDataValues[rowIndex].hiddenPos;
    var preFilledCell=1;
    if(hiddenPosArray.indexOf(colIndex)!==-1){
      preFilledCell=0;
    }
  	const [gametype_row_stringval,gametype_col_stringval] = gameType.split("x");
  	const gametype_row = parseInt(gametype_row_stringval);
  	const gametype_col = parseInt(gametype_col_stringval);
  	var classNames = (rowIndex+1)%gametype_row===0?"gridborderrow":"";
  	classNames += (colIndex+1)%gametype_col===0?" gridbordercol":"";
    return <IonCol 
			style={
				{	fontWeight:preFilledCell?"bold":"normal",
					backgroundColor: errorArray.indexOf(rowIndex+"-"+colIndex) !== -1 ? "red" : ActiveList.indexOf(rowIndex+"-"+colIndex)>=0? selectedBox===(rowIndex+"-"+colIndex)?"lightblue":"#EAEFF1" : "" 
				}
			} 
			className={classNames}
			onClick={ () => selectBox(rowIndex,colIndex) } id={rowIndex+"-"+colIndex} key={colIndex}>
      {eachval===""?" ":eachval}
      </IonCol>
    })
    return <IonRow key={rowIndex}>{each_row_values}</IonRow>
  }) : "";

  function updateNumber_undo(val: string){
    const [rIndex,cIndex] = selectedBox.split("-");
    var pos = rIndex+'-'+cIndex;   
    var preVal = dataValues[parseInt(rIndex)][parseInt(cIndex)];   
    if(preVal !== val){ 
      var tempUndoArray = Array.from(undoArray);       
      tempUndoArray.push({row:parseInt(rIndex),col:parseInt(cIndex),curValue:val,preValue:preVal});
      setUndoArray(tempUndoArray);
      console.log(tempUndoArray);
      setUndoArray(tempUndoArray);
      updateNumber(val,false);
    }
  }

  function updateNumber(val: string,flag: boolean){  
    var selectedBox_value="";
    if(flag==true)
    {
      if(undoArray.length>1){
        var rowIndex = undoArray[undoArray.length-1].row;  
        var colIndex = undoArray[undoArray.length-1].col;
        selectedBox_value=rowIndex+"-"+colIndex;
        setSelectedBox(rowIndex+"-"+colIndex);
        var value_to_update = undoArray[undoArray.length-1].preValue;
        var tempUndoArray = Array.from(undoArray);            
        tempUndoArray.pop();    
        setUndoArray(tempUndoArray);
        console.log("AFter Removing from Undo");
        console.log(undoArray);
        /*var updatedDataValues  = [] as any;
        updatedDataValues = Array.from(dataValues);
        updatedDataValues[rowIndex][colIndex] = value_to_update;
        setDataValues(updatedDataValues);*/
        console.log("Updated data values");
        console.log(dataValues);
        val = value_to_update;
      }
      else{
        alert("No changes available to undo.");
        return;
      }
    }
    else{
      selectedBox_value=selectedBox;
    }
    console.log("selectedBox_value "+selectedBox_value);
    if(selectedBox_value!=="" ){
      var tempNumbersArray=[{numberval:numbersArray[0].numberval,numbercount:numbersArray[0].numbercount}];
      numbersArray.map((eachrow:any,rowIndex:any) => {
        if(rowIndex>0)
        tempNumbersArray.push({numberval:eachrow.numberval,numbercount:eachrow.numbercount});
      });      

      const [rIndex,cIndex] = selectedBox_value.split("-");
      console.log("check : "+dataValues[parseInt(rIndex)][parseInt(cIndex)]+" - "+val)
      if(dataValues[parseInt(rIndex)][parseInt(cIndex)] !== val){ // check if same number is entered in the cell
        if(val!=="" || flag==true)
        {          
          if(dataValues[parseInt(rIndex)][parseInt(cIndex)]>0) {
            tempNumbersArray[dataValues[parseInt(rIndex)][parseInt(cIndex)]].numbercount=tempNumbersArray[dataValues[parseInt(rIndex)][parseInt(cIndex)]].numbercount-1;          
          }
          else {
            tempNumbersArray[0].numbercount=tempNumbersArray[0].numbercount-1;  
          }
          if(val!=="")
          tempNumbersArray[parseInt(val)].numbercount=tempNumbersArray[parseInt(val)].numbercount+1;  
          else
          tempNumbersArray[0].numbercount=tempNumbersArray[0].numbercount+1;    
          setNumbersArray(tempNumbersArray);        
          //if(flag==true)
          flag=false;
        }
        //if(flag!=true)
        //{           
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
          return updatedDataValues;
          });
        //}
        checkIfCorrect(parseInt(rIndex),parseInt(cIndex),val);     
      } 
    }
    else{
      alert("Please select a box to fill..");
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
        //console.log("row values "+dataValues[r][cIndex])
        if(r !== rIndex && dataValues[r][cIndex] === numberval) {
          errArray.push(r+"-"+cIndex);
        }
      } 
      for(var c=0;c<rowLength;c++){
        //console.log("row values "+dataValues[rIndex][c])
        if(c !== cIndex && dataValues[rIndex][c] === numberval) {
          errArray.push(rIndex+"-"+c);
        }
      }
	  /*Grid validate*/
		var gridrow =0;
		var gridcolumn = 0;
		const [gametype_row_stringval,gametype_col_stringval] = gameType.split("x");
		const gametype_row = parseInt(gametype_row_stringval);
		const gametype_col = parseInt(gametype_col_stringval);
		if(rIndex< gametype_row){
			gridrow = 0;
		 } else{
			 const temp = rIndex;
			gridrow = Math.floor(temp/gametype_row);
		}
		if(cIndex< gametype_col){
			gridcolumn = 0;
		} else{
			gridcolumn = Math.floor(cIndex/gametype_col);
		 }
		
		var startrow = (gametype_row * gridrow);
		var startcol = (gametype_col * gridcolumn);
		
		for(var i = startrow; i<startrow+gametype_row;i++){
			for(var j = startcol; j<startcol+gametype_col;j++){
				if(numberval == dataValues[i][j]){
					 errArray.push(i+"-"+j);
				 }
			 }
		 }
		 if(showAutoCheckMistakes){
			if(origDataValues[rIndex].rowData[cIndex] != numberval){
				errArray.push(rIndex+"-"+cIndex);
			}
		 }
      if(errArray.length>0){
		  console.log(mistakesUser);
		  console.log(mistakesCount);
		  //console.log(mistakesUser);
		  if(mistakesCheck){
			  setMistakesUser(mistakesUser+1)
			  if(mistakesUser+1>=mistakesCount){
				  alert("bow you lost the game");
			  }
			  
		  }
        errArray.push(rIndex+"-"+cIndex);
      }
    }
    setErrorArray(errArray);
  }

  function clearGridValue(){
    if(selectedBox!==""){
      var [rIndex,cIndex] = selectedBox.split("-");
      
      const value_to_be_cleared = dataValues[parseInt(rIndex)][parseInt(cIndex)];
      if(value_to_be_cleared!==" " && value_to_be_cleared!==""){
        var tempNumbersArray=[{numberval:numbersArray[0].numberval,numbercount:numbersArray[0].numbercount}];
        numbersArray.map((eachrow:any,rowIndex:any) => {
          if(rowIndex>0)
          tempNumbersArray.push({numberval:eachrow.numberval,numbercount:eachrow.numbercount});
        });      
        tempNumbersArray[0].numbercount=tempNumbersArray[0].numbercount+1;  
        tempNumbersArray[value_to_be_cleared].numbercount=tempNumbersArray[value_to_be_cleared].numbercount-1;  
        setNumbersArray(tempNumbersArray);

        var tempUndoArray = Array.from(undoArray);       
        tempUndoArray.push({row:parseInt(rIndex),col:parseInt(cIndex),curValue:"",preValue:value_to_be_cleared});
        setUndoArray(tempUndoArray);

        const hiddenPosArray: number[] = origDataValues[parseInt(rIndex)].hiddenPos;
        if(hiddenPosArray.indexOf(parseInt(cIndex))!==-1){
          updateNumber("",false)
        }
      }
    }
    else{
      alert("Please select a cell to clear.")
    }
  }

  function hintDisplay(){
    getItem("hints").then(function(result){
      if(result.value==="enabled"){
        if(selectedBox!==""){
		  var [rIndex,cIndex] = selectedBox.split("-");
		  updateNumber(origDataValues[parseInt(rIndex)].rowData[parseInt(cIndex)],false);
		}
      }
      else{
        alert("Please enable hints in settings.");
      }
    });
  }  

  /* ********* SETTINGS PAGE SECTION ************* */
  const [hintsOption,setHintsOption] = useState(false); 
  const [showErrorsOption,setShowErrorsOption] = useState(false); 
  const [showAutoCheckMistakes,setShowAutoCheckMistakes] = useState(false); 
  const [mistakesCheck,setmistakesCheck] = useState(false); 
  const [mistakesCount, setMistakesCount] = useState(0);
  const [mistakesUser, setMistakesUser] = useState(0);
  const [showPopover, setShowPopover] = useState(false);
  
  const [rangeValue, setRangeValue] = useState<{
    lower: number;
    upper: number;
  }>({ lower: 1, upper: 30 });
  const [timerUser, setTimerUser] = useState(rangeValue.lower);
  function move_back(){ // not used now
    //history.goBack();
  }

  function getItem(keyname: string) {
    return Storage.get({ key: keyname });
  }
	function setRangeValueChange(value:number){
		setMistakesCount(value);
		Storage.set({
		  key: "mistakesCount",
		  value: ""+value
		});
	}
  function setOptionsValue(val: boolean,id: string){
    if(id==="show_errors"){
      setShowErrorsOption(val);
    }
    else if(id==="hints"){
      setHintsOption(val);
    }
	if(id==="autocheck"){
		setShowAutoCheckMistakes(val);
	}
	if(id==="mistakesCheck"){
		setmistakesCheck(val);
	}
    Storage.set({
      key: id,
      value: val?"enabled":"disabled"
    });
  }

  /* *************** STATISTICS ****************** */
  const [statisticsData,setStatisticsData] = useState([{gameType:"",gameLevel:"",gamesWon:0,gamesLost:0,bestTime:""}])
  const statisticsDataDisplay = statisticsData.map(eachlevel => {
    if(eachlevel.gameType!==""){
      let gamelevel_text = (eachlevel.gameLevel === "" || eachlevel.gameLevel === "0") ? "Easy" : eachlevel.gameLevel;
      return <IonRow>
        <IonCol>{eachlevel.gameType}</IonCol>
        <IonCol>{gamelevel_text}</IonCol>
        <IonCol>{eachlevel.gamesWon}</IonCol>
        <IonCol>{eachlevel.gamesLost}</IonCol>
        <IonCol>{eachlevel.bestTime}</IonCol>
      </IonRow>
    }
    else{
      return "No statistics available yet."
    }
  })



  useEffect(() => {
    if(numbersArray.length>1 && numbersArray[0].numbercount === 0){
        var gameresult="";
        if(errorArray.length<=0){
          gameresult="won";
          setGameResult("WON")
        }
        else{
          gameresult="lost";
          setGameResult("LOST")
        }

        var new_statistic_data={gameType:gameType,gameLevel:gameLevel,gamesWon:0,gamesLost:0,bestTime:"00:00:00"};
        if(gameresult=="won")
        new_statistic_data.gamesWon = new_statistic_data.gamesWon + 1;
        else
        new_statistic_data.gamesLost = new_statistic_data.gamesLost + 1;
          
        if(statisticsData[0].gameType===""){
          var newstatisticsdata_array = [new_statistic_data];
          setStatisticsData(newstatisticsdata_array);
        }
        else{
          var option_exists=false;
          var newstatisticsdata_array = statisticsData.map(each_statistic => {
            if(each_statistic.gameType == gameType && each_statistic.gameLevel == gameLevel){
                option_exists = true;
                each_statistic.gamesWon = each_statistic.gamesWon+ new_statistic_data.gamesWon;
                each_statistic.gamesLost = each_statistic.gamesLost+ new_statistic_data.gamesLost;
                //need to check best time and include
            }
            return each_statistic;
          }) 
          if(!option_exists){
            newstatisticsdata_array.push(new_statistic_data);
          }
          setStatisticsData(newstatisticsdata_array);
        }

        //newstatisticsdata_array.unshift({gameType:gameType,gameLevel:gameLevel,gamesWon:0,gamesLost:0,bestTime:"00:00:00"});

        console.log()
        Storage.set({
          key: "statisticsData",
          value: JSON.stringify(newstatisticsdata_array)
        });

    }
  },[numbersArray,errorArray]);

  /* *************************************** */

  return (
    <div>
      
      <IonHeader>
        <IonToolbar color="danger">
          <IonButtons slot="start">
              <IonImg onClick={() => setDisplayPage("pagediv_home")} src={homeIcon} className="home_icon"></IonImg>
            </IonButtons> 
          <IonTitle size="large">
            SUDOKU
          </IonTitle>
          <IonButtons slot="end">
              <IonImg onClick={() => setDisplayPage("pagediv_setting")} src={settingsIcon} className="settings_icon"></IonImg>
              
            </IonButtons> 
        </IonToolbar>
      </IonHeader>
      
      <IonPage>

        <div className="header_space"></div>
        <div className={displayPage === "pagediv_home" ? "pagediv show_pagediv" : "pagediv"} id="pagediv_home">
            <IonContent>
                <IonItem>
                  <IonLabel>Game Type</IonLabel>
                  <IonSelect value={gameType} okText="Okay" cancelText="Dismiss" onIonChange={e => gameTypeSelected(e.detail.value)}>
                    <IonSelectOption value="">Choose</IonSelectOption>
                    {game_types_display}
                  </IonSelect>
                </IonItem>
                <IonItem style={{display:gameLevelsArray.length>0 ? "":"none"}}>
                  <IonLabel>Game Level</IonLabel>
                  <IonSelect value={gameLevel} okText="Okay" cancelText="Dismiss" onIonChange={e => gamelevelSelected(e.detail.value)}>
                    <IonSelectOption value="">Choose</IonSelectOption>
                    {game_levels_display}
                  </IonSelect>
                </IonItem>
                <br />
                <IonButton type="button" onClick={e => start_game(false)} expand="block" color="dark" class="ion-margin">
                  Start Game
                </IonButton>
				<IonButton type="button" onClick={e => showRange(true)} expand="block" color="dark" class="ion-margin">
                  Play Against Time
				  </IonButton>
				 
            </IonContent> 
			 <IonPopover
					isOpen={showPopover}
					onDidDismiss={e => setShowPopover(false)}
				  >
					<IonList>
					
					  <IonItem>
					  
					<IonRange pin={true} min={rangeValue.lower} max={rangeValue.upper} snaps={true} onIonChange={e => setTimerGame(e.detail.value as number)} />
					<IonButton type="button" onClick={e => start_game(true)} expand="block" color="dark" class="ion-margin">
					  Start
					  </IonButton>
					</IonItem>
					</IonList>
				  </IonPopover>
        </div>

        <div className={displayPage === "pagediv_puzzle" ? "pagediv show_pagediv" : "pagediv"} id="pagediv_puzzle">
           <IonContent>
            <div style={{textAlign:"center",paddingTop:"75px"}}>
			
					<div style={{display:"inline-block",width:"95%",maxWidth:"400px"}}>
						<div style={{	visibility:(!mistakesCheck)?"hidden":"visible",display:"inline-block",float:"left"}}>Mistakes : {mistakesUser+"/"+mistakesCount}</div>
						<div style={{float:"right"}}>
							<IonImg src={stopwatchico} className="timer_icon" style={{display:"inline-block"}}></IonImg>&nbsp;
							<div id="timerDiv" style={{display:"inline-block"}}>00:00:00	</div>
						</div>
					</div>

              <IonGrid>
                {data_display}
              </IonGrid>
              <div className="options_div">
                <IonButton color="warning" onClick={clearGridValue} size="small">Clear</IonButton>
                <IonButton color="warning" onClick={hintDisplay} size="small">Hint</IonButton>
				<IonButton color="warning" onClick={()=>updateNumber("",true)} size="small">Undo</IonButton>
              </div>
              <div className="numbers_div">
                {numbersArray.map(val => {
                    var numbers_div_classname="eachnumber_div";
                    if(val.numberval <= 0)
                    numbers_div_classname+=" hide";  
                    else
                    numbers_div_classname+=val.numbercount == rowLength ? ' hiddenVis':'';
                    return <div key={val.numberval} onClick={()=>updateNumber_undo(""+val.numberval+"")} className={numbers_div_classname}>{val.numberval}</div>
                  }
                )}
              </div>
            </div>
          </IonContent>
        </div>

        <div className={displayPage === "pagediv_setting" ? "pagediv show_pagediv" : "pagediv"} id="pagediv_setting">
            
				<IonContent>
				  <IonButton type="button" onClick={e => dataValues.length>0 ? setDisplayPage("pagediv_puzzle") : setDisplayPage("pagediv_home")} fill="clear" size="default" color="primary" class="ion-margin">&lt; back</IonButton>
          <IonButton type="button" onClick={e => setDisplayPage("pagediv_statistics")} size="default" color="secondary" class="ion-margin">Statistics</IonButton>
				<IonItemDivider color="dark">Settings</IonItemDivider>
				<IonItem>
				  <IonLabel>Show Errors</IonLabel>
				  <IonToggle checked={showErrorsOption} onIonChange={e => setOptionsValue(e.detail.checked,"show_errors")} />
				</IonItem>
				<IonItem>
				  <IonLabel>Hints</IonLabel>
				  <IonToggle checked={hintsOption} onIonChange={e => setOptionsValue(e.detail.checked,"hints")} />
				</IonItem>
				<IonItem>
				  <IonLabel>Auto-Check Mistakes</IonLabel>
				  <IonToggle checked={showAutoCheckMistakes} onIonChange={e => setOptionsValue(e.detail.checked,"autocheck")} />
				</IonItem>
				<IonItem>
				  <IonLabel>Mistakes Count</IonLabel>
				  <IonToggle checked={mistakesCheck} onIonChange={e => setOptionsValue(e.detail.checked,"mistakesCheck")} />
				</IonItem>
				<IonItem>
					<IonLabel>Mistakes Threshold : {mistakesCount}</IonLabel>
				</IonItem>
				<IonList>
					
					  <IonItem>
					  
					<IonRange pin={true} disabled={!mistakesCheck} value={mistakesCount} min={3} max={10} snaps={true} onIonChange={e => setRangeValueChange(e.detail.value as number)} />
					</IonItem>
			</IonList>
				</IonContent>
			
        </div>



        <div className={displayPage === "pagediv_statistics" ? "pagediv show_pagediv" : "pagediv"} id="pagediv_statistics">
          <IonContent>
            <h1>Statistics</h1>
            <IonGrid> 
              <IonRow>
                <IonCol>Game Type</IonCol>
                <IonCol>Game Level</IonCol>
                <IonCol>Games Won</IonCol>
                <IonCol>Games Lost</IonCol>
                <IonCol>Best Time</IonCol>
              </IonRow>
              {statisticsDataDisplay}
            </IonGrid>
          </IonContent>
        </div>

      </IonPage>

      <div className={gameResult !=="" ? "gameresult_div":"gameresult_div hide"}>
        <div className="gameresult">
          <IonText color={gameResult==="WON" ? "success" : "danger"}><h1>{gameResult==="WON" ? "GAME WON" : "GAME LOST"}</h1></IonText>
          <IonButton type="button" onClick={e => gameover_goto("pagediv_home")} size="default" expand="block" color="tertiary" class="ion-margin">Start New Game</IonButton>
          <IonButton type="button" onClick={e => gameover_goto("pagediv_statistics")} size="default" expand="block" color="secondary" class="ion-margin">Show Statistics</IonButton>
        </div>
      </div>

    </div>
  );
};

export default Home;