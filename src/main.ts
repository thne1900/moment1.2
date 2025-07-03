import './style.css'

//Interface med kursobjekt
interface CourseInfo{
  code:string;
  coursename:string;
  progression: string;
  syllabus:string;
}

//En array som lagrar kursdata:
let coursesData:CourseInfo[]=[];

//Vid sidinladdning: från localStorage eller från API.
window.onload=()=>{
loadCoursesLocalStorage()||
getCourses();
}

//Funktion för localStorage:
function loadCoursesLocalStorage():boolean {
  const dataStorage:string|null=localStorage.getItem("coursesData");
  if (dataStorage) {
    try {
      const parsedData:CourseInfo[]=JSON.parse(dataStorage);
      coursesData=parsedData;

      displayCoursesList();

      console.log("Kursdatan hämtades från LocalStorage");
      return true;
    }catch(error) {
      console.error("Inhämtningen från localstorage misslyckades", error);
      return false;
    }
    }
    return false;
  }

//Asynkron funktion för att hämta kurser via API. 
async function getCourses(): Promise<void> {
  const url="https://webbutveckling.miun.se/files/ramschema_ht24.json";

  try {
    const response=await fetch(url);
    if(!response.ok) {
      throw new Error("Fel vid inhämtningen av kursinformationen");
    }
    const data:CourseInfo[]=await response.json();
    coursesData=data;

    displayCoursesList();

    localStorage.setItem("coursesData", JSON.stringify(data));

    data.forEach(course=>{
      console.log(`${course.coursename}`);

    });
  }catch (error){
    console.error("Ett fel har inträffat:", error);
  }
}

//Funktion för att få ut kurserna, DOM
function displayCoursesList():void{
  const courseList:HTMLElement|null=document.getElementById("coursesInfoList");
  if(!courseList){
    console.error("Elementet för listan hittades inte");
    return;
  }
  
 courseList.innerHTML="";

 coursesData.forEach((course, index)=>{
  const li:HTMLLIElement=document.createElement("li");

const links:HTMLAnchorElement=document.createElement("a");
links.href=course.syllabus;
links.innerHTML=`${course.syllabus}`;

  li.innerHTML=`<strong>KURSKOD:</strong> ${course.code} <strong>KURSNAMN:</strong> 
  <i>${course.coursename}</i> <strong>PROGRESSION:</strong> ${course.progression} <strong>KURSLÄNK:</strong>`;
  
  li.appendChild(links);


//Tabort-knapp:
let deleteButton:HTMLButtonElement=document.createElement("button");
deleteButton.innerHTML="Ta bort kurs";

//Styling på tabort-knappen:
deleteButton.style.marginLeft="15px";
deleteButton.style.padding="1%";
deleteButton.style.backgroundColor="pink";
deleteButton.style.cursor="pointer";


deleteButton.addEventListener("click",()=> {
  removeCourse(index); 
});

li.appendChild(deleteButton);

  courseList.appendChild(li);

  //Styling på listan
  li.style.margin="4%";

 });
}

//Funktion för att lägga till kurs
function addCourse(newCourse:CourseInfo):void{
  coursesData.push(newCourse);
  
  displayCoursesList();

  localStorage.setItem("coursesData", JSON.stringify(coursesData));
}

//Validering för kontroll:
function uniqueCourseCode(code:string):boolean {
  return!coursesData.some(course=>course.code===code);
}

function correctProg(progression:string):boolean {
  const acceptProg:string[]= ["A", "B","C"];
  return acceptProg.includes(progression);
}

document.getElementById("addCourseForm")?.addEventListener("submit", (event)=>{
  event.preventDefault();

const code=(document.getElementById("code") as HTMLInputElement).value;
const coursename=(document.getElementById("name")as HTMLInputElement).value;
const progression=(document.getElementById("prog") as HTMLInputElement).value;
const syllabus=(document.getElementById("syllabus") as HTMLInputElement).value;

if(!uniqueCourseCode(code)){
  alert ("Kurskoden är inte unik! Det finns redan en kurs med denna kurskod");
  return;
}

if(!correctProg(progression)){
  alert ("Progressionen är inte korrekt! Begränsad till A, B eller C.");
  return;
}

const newCourse:CourseInfo= {
  code,
  coursename,
  progression,
  syllabus

};

addCourse(newCourse);

//Ta bort inmatningen i inputfälten. 
(document.getElementById("code") as HTMLInputElement).value="";
(document.getElementById("name") as HTMLInputElement).value="";
(document.getElementById("prog") as HTMLInputElement).value="";
(document.getElementById("syllabus") as HTMLInputElement).value="";

});

function removeCourse(index:number):void {

  coursesData.splice(index, 1);
  localStorage.setItem("coursesData", JSON.stringify(coursesData));

  displayCoursesList();

}

