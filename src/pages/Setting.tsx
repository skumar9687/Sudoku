import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import { IonContent, IonPage, IonTitle, IonButton, IonItemDivider, IonItem, IonLabel, IonToggle } from '@ionic/react';

/* CSS */
import '../App.css';

/* Page Components */
import Header from './Header';

/* Storage Plugin */
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

//function Setting(props: Object){
const Setting: React.FC = (props) => {

let history = useHistory();
	const [hintsOption,setHintsOption] = useState(false); 
	const [showErrorsOption,setShowErrorsOption] = useState(false); 
	
	useEffect(() => {
		getItem("hints").then(function(result){
			setHintsOption(result.value==="enabled" ? true : false);
		});
		getItem("show_errors").then(function(result){
			setShowErrorsOption(result.value==="enabled" ? true : false);
		});
	}, []);

	function move_back(){
		history.goBack();
	}

	function getItem(keyname: string) {
		return Storage.get({ key: keyname });
	}

	function setOptionsValue(val: boolean,id: string){
		if(id==="show_errors")
		setShowErrorsOption(val);
		else if(id==="hints")
		setHintsOption(val);
		Storage.set({
			key: id,
			value: val?"enabled":"disabled"
		});
	}

	return(
	    <IonPage>
		  <IonContent>
	        <IonButton type="button" onClick={e => move_back()} fill="clear" size="default" color="primary" class="ion-margin">&lt; back</IonButton>
	      <IonItemDivider color="dark">Settings</IonItemDivider>
	      <IonItem>
	        <IonLabel>Show Errors</IonLabel>
	        <IonToggle checked={showErrorsOption} onIonChange={e => setOptionsValue(e.detail.checked,"show_errors")} />
	      </IonItem>
	      <IonItem>
	        <IonLabel>Hints</IonLabel>
	        <IonToggle checked={hintsOption} onIonChange={e => setOptionsValue(e.detail.checked,"hints")} />
	      </IonItem>
	      </IonContent>
	    </IonPage>
	)
}

export default Setting