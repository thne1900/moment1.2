import './style.css'

//Kursobjekt med typer
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

//Funktion för localstorage:
function loadCoursesLocalStorage():boolean {
  const dataStorage=localStorage.getItem("coursesData");
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
    console.error('Ett fel har inträffat:', error);
  }
}

//Funktion för att få ut kurserna, DOM
function displayCoursesList(){
  const courseList:HTMLElement|null=document.getElementById("coursesInfoList");
  if(!courseList){
    console.error("Elementet för listan hittades inte");
    return;
  }
  
 courseList.innerHTML="";

 coursesData.forEach(course=>{
  const li=document.createElement("li");

let links=document.createElement("a");
links.href=course.syllabus;
links.innerHTML=`${course.syllabus}`;

  li.innerHTML=`<strong>KURSKOD:</strong> ${course.code} <strong>KURSNAMN:</strong> 
  <i>${course.coursename}</i> <strong>PROGRESSION:</strong> ${course.progression} <strong>KURSLÄNK:</strong>`;
  
  li.appendChild(links);
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
  const acceptProg= ["A", "B","C"];
  return acceptProg.includes(progression);
}

document.getElementById("addCourseForm")?.addEventListener("submit", (e)=>{
  e.preventDefault();

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

