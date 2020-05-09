#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;
 class grid {
 	int height,width,sqrgrid;
 	
 	public:
 	int gridArr[9][9];
 	bool grids[9];
 	void setSize(int);
 	void generateGrid();
 	bool populateVal(int, int, int,int);
 	bool populateGrid(int ,int );
 	void printGrid();
 	bool validateH(int,int, int);
 	bool validateR(int,int, int);
 	bool validateG(int,int, int);
 };
 void grid::setSize(int x){
 	height = x*x;
 	width = x*x;
 	sqrgrid = x;
	for(int i=0;i<width;i++){
	 	for(int j=0;j<width;j++){
	 		gridArr[i][j] = 0;
 	 	}
	 }
 }
 void grid::generateGrid(){
 	int randomNumber = rand();
 	int newNum;
	 newNum =  rand()%10;
 	for(int i=0,l=0;i<height;){
 		for(int j=i;j<i+this->sqrgrid;){
 			for(int k=i;k<i+this->sqrgrid;){
 				if(validateG(j,k,newNum)){
 					gridArr[j][k]=newNum;
 					k=k+1;
				 }
				 else {
				 	if(k==i+this->sqrgrid){
					 	k=k+1;
					}
				 	newNum = rand()%10;
				 }
			 }
			 j=j+1;
		 }
		 grids[i+l] = true;
		//cout << "grids Filled " << i+l << endl;
		 i=i+this->sqrgrid;
		 l = l+1;
	 }
	 
 	
 	cout << newNum << "\n";
	int gridcounter = 0;
	int row = 0;
	int col = 0;
	int iti = 0;
			//for(int j=0;j<1;){
				//newNum =  rand()%10;
				//if(newNum !=0){
					populateGrid(0,3);
				//	j=j+1;
					
			//	} 
	 			
			// }
	return;
	
 }
bool grid::populateGrid(int row,int col){
	
	if(col>=9 && row<8/*(height-1)*/)	{
		row = row+1;
		col=0;
	}
	if(row>=9 && col>=9) {
		return true;
	}
	
	if(row<3)
	{
		if(col<3)
		{
			col = 3;
		}
	
	}
	
	//first and third grid in second row

	else if (row<6)
	{
	 if(col>=3 && col<=6)
	  {
	  	col = col + 3;
	  }
	
	}
	
	//last row checking grid 1 and 2
	
	else
	{
		if(col==6)
		{
			col=0;
			row = row+1;
			if(row>=9)
			{
				return true;
			}
		}
	}
	/*if(gridArr[row][col] != 0){
		populateGrid(row,col+1);
	}*/
	
	for(int num_to_fill = 1; num_to_fill<=width;num_to_fill++) {
		bool row_check = validateH(num_to_fill,row,col);
		bool col_check =validateR(num_to_fill,row,col);
		bool grid_check =validateG(row, col, num_to_fill);
		if(row_check && col_check &&  grid_check )
		{
		//	cout<< "ROW : " << row <<"COL : "<< col <<"Val : "<< num_to_fill <<endl;
			gridArr[row][col]= num_to_fill;
			if(populateGrid(row,col+1))//recursive call by incrementing column
			{
				
			 return true;
			}
			gridArr[row][col]=0; //if value cannot be filled set it to zero
		}
	}
	return false;

}
 bool grid::populateVal(int val,int row, int col,int iti){
 	if(this->gridArr[row][col]!=0){
 		if(row+1 > height){
 			if(col+1 > width){
 				return true;
			 }else {
			 	col = col+1;
			 }
		 } else if(col+1>width){
		 	row = row+1;
		 } else {
		 	col = col+1;
		 }
	 }
 	bool hFail,GFail,CFail;
	 if(this->validateG(row,col,val)){
	 	if(this->validateH(val,row,col)){
		 	if(this->validateR(val,row,col)){
			 	
			}
			else {
				CFail = true;
			}
			
		} else {
			hFail = true;
		}
	 } else {
	 	GFail = true;
	 }
	 int gridrow = row/this->sqrgrid;
	
	int gridcolumn = col/this->sqrgrid;	

	int nextgridrow,nextgridcol;
	cout <<"Iti : " << iti << "\t Row : " << row <<"\n";
	cout <<"Iti : " << iti << "\t Column : " << col <<"\n";
	cout <<"Iti : " << iti << "\t Val : " << val <<"\n";
	if(iti==100){
			 		this->gridArr[row][col] = val;
			 		return true;
	 }
	if(GFail){
		nextgridrow = row+sqrgrid;
		nextgridcol = col + sqrgrid;
	
	 	
 	} 
	 if(hFail){
		 	
	 	nextgridrow = (row+1);
	 
	 	nextgridcol = col;
	 	
	 	
		 /*if(tempcol <this->width){
	 		nextgridcol = (this->sqrgrid * gridcolumn)+this->sqrgrid;
		 } else {
		 	nextgridcol = (this->sqrgrid * gridcolumn)- this->sqrgrid;
		 }*/
	 	cout << "HFAIL : \n";
	 	
	 	
	 }
	 if(CFail){
		 	
	 	int temprow = row;
	 	//int tempcol = (this->sqrgrid * gridcolumn)+1;
	 	int tempcol = col+1;
	 	
	 	nextgridrow = row;
	 
	 	nextgridcol = tempcol;
	 	cout << "CFAIL : \n";

	 	
	 } 
	 
	 if(!CFail && !GFail && !hFail){
		 nextgridcol = (col + sqrgrid)%this->width;
		 cout << (col + sqrgrid) << endl;
		 nextgridrow = row;
		 if((col + sqrgrid ) > this->width){
						nextgridrow = row+this->sqrgrid;
						nextgridcol = 0;
					}
					
					
		 cout << "GDefault : \n";

		this->gridArr[row][col] = val;
		
		
	 }
	 
	 if(nextgridrow > height ){
			if(nextgridcol >= width){
				return true;
			}else {
				nextgridrow = row;
			}
		} else if(nextgridcol> width) {
			nextgridcol = col;
		}
	cout <<"Iti : " << iti << "\t Row : " << nextgridrow <<"\n";
	cout <<"Iti : " << iti << "\t Column : " << nextgridcol <<"\n";
	cout <<"Iti : " << iti << "\t Val : " << val <<"\n";
 	cout << "Iti after increment : "<<iti<< "\n";
	 iti = iti + 1;
 	populateVal(val,nextgridrow,nextgridcol,iti);
	 return true;

 }
 bool grid::validateH(int val,int row, int col){
 		int i = row;
 		for(int j=0;j<width;j++){
 			if(val == this->gridArr[i][j]){
 				return false;
			 }
		 }
	 
	 return true;
 }
 bool grid::validateR(int val,int row, int col){
 		int i = col;

 		for(int j=0;j<this->height;j++){
 			if(val == this->gridArr[j][i]){
 				return false;
			 }
		 }
	 
	 return true;
 }
 bool grid::validateG(int row,int col,int val){

 	int gridrow = 0;
 	int gridcolumn = 0;
 	if(row< this->sqrgrid){
 		gridrow = 0;
	 } else{
 		gridrow = row/this->sqrgrid;
 	}
 	if(col< this->sqrgrid){
 		gridcolumn = 0;
 	} else{
 		gridcolumn = col/this->sqrgrid;
	 }
 	
 	int startrow = (this->sqrgrid * gridrow);
 	int startcol = (this->sqrgrid * gridcolumn);

 	for(int i = startrow; i<startrow+this->sqrgrid;i++){
 		for(int j = startcol; j<startcol+this->sqrgrid;j++){
 			if(val == gridArr[i][j]){
 				return false;
			 }
		 }
	 }
	 return true;
 }
 
 void grid::printGrid(){
 	for(int i=0;i<height;i++){
 		for(int j=0;j<width;j++){
 			cout << gridArr[i][j] << "\t";
		 }
		 cout <<"\n";
	 }
 }
 void printGrid(grid g){
	for(int i=0;i<9;i++){
 		for(int j=0;j<9;j++){
 			cout << g.gridArr[i][j] << "\t";
		 }
		 cout <<"\n";
	 }
}
int main() {
	int size;
	srand((unsigned) time(0));
   cout << "Hello, world!" << endl;
   cout << "Enter the size of the grid.." << endl;
   cin >> size;
   grid g;
   g.setSize(size);
   printGrid(g);
   cout << "\n";
   g.generateGrid();
   printGrid(g);
   
   return 0;
}


