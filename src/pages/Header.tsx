import React from "react";
import {Link} from "react-router-dom";
import {IonHeader, IonToolbar, IonTitle, IonImg, IonButtons } from "@ionic/react";

/* Icons & Images */
import homeIcon from "./images/home-outline.svg";
import settingsIcon from "./images/settings-outline.svg";

function Header(){
	return(
      <IonHeader>
        <IonToolbar color="danger">
        	<IonButtons slot="start">
            	<Link to="/home"><IonImg src={homeIcon} className="home_icon"></IonImg></Link>
            </IonButtons>	
          <IonTitle size="large">
            SUDOKU
          </IonTitle>
        	<IonButtons slot="end">
            	<Link to="/setting"><IonImg src={settingsIcon} className="settings_icon"></IonImg></Link>
            </IonButtons>	
        </IonToolbar>
      </IonHeader>
	)
}

export default Header