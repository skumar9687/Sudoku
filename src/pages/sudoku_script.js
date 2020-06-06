class sudoku{
	constructor(){
		this.height="";	
		this.width="";	
		this.sqrgridx="";	
		this.sqrgridy="";	
		this.gridArr=[];	
		this.solvedGridArr=[];	
		this.grids="";	
		this.removed_values=[];
	}
 	setSize(row, col){
		this.height = row*col;
		this.width = row*col;
		this.sqrgridx = row;
		this.sqrgridy = col;
		for(var i=0;i<this.height;i++){
			let subGridArray=[];
			for(var j=0;j<this.width;j++){
				//this.gridArr[i][j] = 0;
				subGridArray.push(0);
			}
			this.gridArr.push(subGridArray);
		 }
		}
 	generateGrid(){
		var newNum= Math.floor(Math.random() * this.height) + 1 ;
		for(var i=0,l=0;i<this.height;){
			for(var j=i;j<i+this.sqrgridx;){
				for(var k=l;k<l+this.sqrgridy;){
					if(k>=this.width){
						break;
					}
					newNum = Math.floor(Math.random() * this.height) + 1 ;
					if(this.validateG(j,k,newNum)){
						this.gridArr[j][k]=newNum;
						k=k+1;
					 }
					 else {
					 }
				 }
				 j=j+1;
			 }			 
			 i=i+this.sqrgridx;
			 l=l+this.sqrgridy;
		 }		 
		var gridcounter = 0;
		var row = 0;
		var col = 0;
		var iti = 0;
		this.populateGrid(0,this.sqrgridy);
		this.populateSolvedGrid();
		return;
	}
	populateSolvedGrid(){
		for(var i=0;i<this.height;i++){
			let subSolvedGridArray=[];
			for(var j=0;j<this.width;j++){
				subSolvedGridArray.push(this.gridArr[i][j]);
			}
			this.solvedGridArr.push(subSolvedGridArray);
		}
	}
	printArr(){
		var output_html="<table>";
		for(var i=0;i<this.height;i++){
			output_html+="<tr>";
			for(var j=0;j<this.width;j++){
				var x = this.gridArr[i][j];
				if(x ==0){
					x = null;
				}
				output_html+="<td style='width:30px;border: 1px solid black;text-align:center'>"+x+"</td>";
			 }			 
			 output_html+="</tr>";
		}
		output_html+="</table>";
		return output_html;
	}
	genJson(){
		var output_data=[];
		output_data[0]={};
		output_data[0]["data"]=[];
		for(var i=0;i<this.height;i++){
			output_data[0]["data"][i]={}
			output_data[0]["data"][i]["rowData"] = this.solvedGridArr[i];
			output_data[0]["data"][i]["hiddenPos"]=[];
			for(var j=0;j<this.width;j++){
				if(this.gridArr[i][j] == 0){
					var lengthArr = output_data[0]["data"][i]["hiddenPos"];
					output_data[0]["data"][i]["hiddenPos"][lengthArr.length]=j;
				}
			}
			
		}
		console.log(JSON.stringify(output_data));
		return JSON.stringify(output_data);
	}
	populateGrid(row ,col ){
		if(col>=this.width && row<(this.height-1))	{
			row = row+1;
			col=0;
		}
		if(row>=this.height && col>=this.width) {
			return true;
		}
		var pos = row ;
		if(row<this.sqrgridx)
		{
			if(col<this.sqrgridy)
			{
				col = this.sqrgridy;
			}
		
		}
		else if (row>=this.sqrgridx)
		{
			var rowPosition = parseInt(row/this.sqrgridx);
			 if(col>=(rowPosition*this.sqrgridy) && col<=((rowPosition*this.sqrgridy)+this.sqrgridy))
			  {
				col = col + this.sqrgridy;
				if(col>=this.width )	{
					if(row<(this.height-1)){
						row = row+1;
						col=0;
					} else {
						return true;
					}
				}
				if(row>=this.height && col>=this.width) {
					return true;
				}
			  }		
		}
		for(var num_to_fill = 1; num_to_fill<=this.width;num_to_fill++) {
			var row_check = this.ValidateRow(num_to_fill,row,col);
			var col_check =this.ValidateCol(num_to_fill,row,col);
			var grid_check =this.validateG(row, col, num_to_fill);
			if(row_check && col_check &&  grid_check )
			{
				this.gridArr[row][col]= num_to_fill;
				if(this.populateGrid(row,col+1))//recursive call by incrementing column
				{
					
				 return true;
				}
				this.gridArr[row][col]=0; //if value cannot be filled set it to zero
			}
		}
		return;
	}	
	validateG(row,col, val){
		var gridrow = 0;
		var gridcolumn = 0;
		if(row< this.sqrgridx){
			gridrow = 0;
		 } else{
			gridrow = parseInt(row/this.sqrgridx);
		}
		if(col< this.sqrgridy){
			gridcolumn = 0;
		} else{
			gridcolumn = parseInt(col/this.sqrgridy);
		 }
		
		var startrow = (this.sqrgridx * gridrow);
		var startcol = (this.sqrgridy * gridcolumn);
		
		for(var i = startrow; i<startrow+this.sqrgridx;i++){
			for(var j = startcol; j<startcol+this.sqrgridy;j++){
				if(val == this.gridArr[i][j]){
					return false;
				 }
			 }
		 }
		return true;
	}
	ValidateRow(val,row, col){
		var i = row;
 		for(var j=0;j<this.width;j++){
 			if(val == this.gridArr[i][j]){
 				return false;
			 }
		 }
		return true;
	}
 	ValidateCol(val,row, col){
		var i = col;
 		for(var j=0;j<this.height;j++){
 			if(val == this.gridArr[j][i]){
 				return false;
			 }
		 }
		return true;
	}
	giveAProblem(level){
		this.removeFromGrid();
		this.removeFromRow();
		this.removeFromCol();
		this.removePerLevel(level);
		//echo "<pre>";
		//print_r(this.removed_values);
	}
 	removeFromGrid(){
		for (var i=0,j=0;i<this.height;){
			var rlimit = i+this.sqrgridx;//set a row limit to make sure it lies within the grid
			var climit = j+this.sqrgridy;//set a col limit to make sure it lies within the grid
			var rPos = Math.floor(Math.random() * ((rlimit+1)-i)) + i ;//rand(i,rlimit);
			var cPos = Math.floor(Math.random() * ((climit+1)-j)) + j ;//rand(j,climit);

			if(rPos >= i && rPos<rlimit){//there is a chance that row position falls in the previous grid (bcos %rlimit) dont increment and try another value
				if(cPos >= j && cPos<climit){//there is a chance that col position falls in the previous grid (bcos %climit) dont increment and try another value
					
					//this.insert(this.gridArr[rPos][cPos],rPos,cPos);
					this.gridArr[rPos][cPos] = 0;					
						j=j+this.sqrgridy;
						if(j>=this.width){/* if col increments beyond the width of grid set it to 0 and increment row*/
							j=0;
							i=i+this.sqrgridy;
						}
					
				}
			}
 		//insert();
		}
	 return;
	}
 	removeFromRow(){
		for(var j=0;j<this.width;){
			var cPos = Math.floor(Math.random() * (this.width-1)) + 1 ;//rand(0,(this.width-1));
			if(this.gridArr[j][cPos] != 0){/* if the value is already removed dont increment and continue for next col position*/
				//this.insert(this.gridArr[j][cPos],j,cPos);
				this.gridArr[j][cPos] = 0;
				
				j=j+1;
			
			 }
		 }
		return;
		
	}
 	removeFromCol(){
		for(var j=0;j<this.height;){
			var rPos = Math.floor(Math.random() * (this.height-1)) + 1 ;//rand(0,(this.height-1));
			if(this.gridArr[rPos][j] != 0){/* if the value is already removed dont increment and continue for next row position*/
					//this.insert(this.gridArr[rPos][j],rPos,j);
					this.gridArr[rPos][j] = 0;
					j=j+1;
				 
			 }
		 }
		return;
	}
	removePerLevel(level){
		var cellToRemove = level*this.height;
		for(var i=0;i<cellToRemove;){
			var row = Math.floor(Math.random() * (this.height-1)) + 1 ;//rand(0,(this.height-1));
			var col = Math.floor(Math.random() * (this.width-1)) + 1 ;//rand(0,(this.width-1));
			if(this.gridArr[row][col] !=0){
				//this.insert(this.gridArr[row][col],row,col);
				this.gridArr[row][col] = 0;
				i = i+1;
				
			}
		}
		return;
	}
	insert(val,row,col){
		let subRemovedValuesArray=[];
		subRemovedValuesArray.push(Array(row,col));
		//this.removed_values[val].push(subRemovedValuesArray);		
		return;
	}
}

export default sudoku;