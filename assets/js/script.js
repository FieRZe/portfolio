// Текущий style.css на странице в который будем добавлять стили:
const style = window.document.styleSheets[0];

/* Появление элементов при скроллинге */
//#region 

const options = {
    //rootMargin: "0px",
    threshold: [ 0.5 ]
};

// объявляем callback-функцию, которая будет срабатывать при пересечении
function onIntersectionFadeIn(entries) {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            entry.target.classList.add("fade-in");
        } 
    })
}

// создаём observer
const observerFadein = new IntersectionObserver(onIntersectionFadeIn, options)

// получаем элементы, за которыми наблюдаем
const fadeInElements = document.querySelectorAll(".show-on-scroll");
// подписываем элементы на observerFadein
fadeInElements.forEach((e) => {observerFadein.observe(e)});

//#endregion





/* Увеличение процентов от нуля до указанного числа */
//#region

// Список всех skill ID и соответствующие им проценты
// {key: value}
// Ищем по ID префиксу все навыки на странице
const skillIDPrefix = "skill-progress__";
// css значение stroke-dashoffset: 230 является 100% от навыка в CSS
const strokeDashOffsetDefault = 230;

// Длина ID префикса, для substring, чтобы получить имя навыка
const skillIDPrefixLength = skillIDPrefix.length;
// Объявляем callback-функцию, которая будет срабатывать при пересечении
const onIntersectionFillProgress = (skillsEntries) => {
    skillsEntries.forEach((entry) => {
        // В каждом навыке, который попадает в область видимости
        if(entry.isIntersecting) {
            // получаем уникальный class-префикс с именем навыка
            const skillClassPrefix = entry.target.id.substring(skillIDPrefixLength);

            // из html конвертируем установленный процент прогресса навыка string в int
            const skillPercentsHtml = Number(entry.target.querySelector(".progress-number").textContent);

            // пересчёт html число в stroke-dashoffset для анимации кругового бара
            const skillStrokeDashOffset = strokeDashOffsetDefault - (strokeDashOffsetDefault / 100 * skillPercentsHtml);
            // пересчёт html число в width для анимации линейного бара
            const skillWidth = skillPercentsHtml;

            // подготовка css стиля для добавления анимации заполнения кругового бара
            const skillClassRule = `.${skillClassPrefix} {
                animation: anim-${skillClassPrefix} 2s linear forwards;
            }`;

            // подготовка css keyframes с уникальным именем для анимации заполнения кругового бара
            const keyframesRule = `@keyframes anim-${skillClassPrefix} {
                100% {
                    stroke-dashoffset: ${skillStrokeDashOffset};
                }
            }`;

            
            // Добавляем progress-helper-container дополнительный класс для данного навыка
            const helperContainer = entry.target.querySelector(".progress-helper-container")
            
            if(helperContainer){
                
                // подготовка css стиля для добавления анимации передвижения процентов
                const skillPercentsMoveRule = `.progress-helper-container-${skillClassPrefix} {
                    @media (min-width: 48em) {
                        justify-content: end;
                        width: ${skillWidth}%;
                        margin-left: 3%;
                        animation: anim-progress-${skillClassPrefix} 2s ease forwards;
                    }
                }`;


                
                // подготовка css стиля для добавления анимации заполнения линейного бара
                const skillProgressBarRule = `.progress-bar-inner-${skillClassPrefix} {
                    @media (min-width: 48em) {
                        width: ${skillPercentsHtml}%;
                        animation: anim-progress-${skillClassPrefix} 2s ease forwards;
                    }
                    
                }`;


                // подготовка css keyframes с уникальным именем для анимации заполнения линейного бара
                const keyframesProgressBarRule = `@keyframes anim-progress-${skillClassPrefix} {
                    0% {
                        width: 0;
                    }
                    100% {
                        width: ${skillWidth}%;
                    }
                }`;

                
                

                style.insertRule(skillPercentsMoveRule);
                style.insertRule(skillProgressBarRule);
                style.insertRule(keyframesProgressBarRule);
                
                
                helperContainer.classList.add(`progress-helper-container-${skillClassPrefix}`);
                // Добавляем progress-helper-container дополнительный класс для данного навыка
                entry.target.querySelector(".progress-bar-inner").classList.add(`progress-bar-inner-${skillClassPrefix}`);

            }


            // Добавить правила в текущий style.css
            style.insertRule(skillClassRule);
            style.insertRule(keyframesRule);
            



            }
        })

}

// создаём observer
const observerSkills = new IntersectionObserver(onIntersectionFillProgress, options);

// Собираем все элементы с нашим ID префиксом, за которыми наблюдаем
const skills = document.querySelectorAll(`[id^=${skillIDPrefix}]`);

// подписываем элементы на observerSkills
skills.forEach((s) => {observerSkills.observe(s)});

//#endregion





/* Слайдер проектов */
//#region
const slider = document.getElementById('projects-slider');
const overflowContainer = slider.querySelector('.projects-container-border');

// const sliderNavigation = document.getElementsByClassName('slider-navigation')[0];


// 1. Находим элемент .projects-slides с помощью get метода, так как это будет событие по клику.
const getSliderContainer = function(e) {
    return e.getElementsByClassName('projects-slides')[0];
}
const copySliderContainer = function(e) {
    return e.cloneNode(true); // true - со всеми дочерними элементами
}








let sliderContainer;
let clonedSliderContainer;

let slides;
let clonedSlides;



// 5. Проводим сортировку в клонированном элементе

// Comparer для сортировки слайдов проектов
function orderComparer(slideA, slideB){
    if(slideA.dataset.order < slideB.dataset.order){
        return -1;
    } 
    else if(slideA.dataset.order > slideB.dataset.order){
        return 1;
    }
    else { return 0; }
}

// объявляем  ф-ию сортировки
function sortProjectSlides(projectSlidesList, updatedContainer) {
    let projectsSlidesArray = Array.from(projectSlidesList);
    let soretedProjects = projectsSlidesArray.sort(orderComparer);

    soretedProjects.forEach((e) => {
        updatedContainer.appendChild(e);
    })
}

// меняем порядок в клонированном элементе
function changeOrder(direction){
    if(direction === "left"){
        for(i = 0; i < clonedSlides.length; i++){
            clonedSlides[i].dataset.order = [i-1];
        }
    
        // если первый элемент имеет order < 0, переместить его в конец
        if(clonedSlides[0].dataset.order < 0) {
            clonedSlides[0].dataset.order = [clonedSlides.length-1];
        }
    } 
    else if (direction === "right")
    {
        for(i = 0; i < clonedSlides.length; i++){
            clonedSlides[i].dataset.order = [i+1];
        }
    
        // Если последний элемент имеет order > длины массива, переместить его в начало.
        //let lastElementOrderValue = clonedSlides[clonedSlides.length-1].dataset.order;
        if(clonedSlides[clonedSlides.length-1].dataset.order > clonedSlides.length-1) {
            clonedSlides[clonedSlides.length-1].dataset.order = [0];
        }
    } 
    else 
    {
        console.error("function changeOrder(direction) error");
    }

    sortProjectSlides(clonedSlides, clonedSliderContainer);
}
/**
 * логика перемещения
 * 1. Находим элемент .projects-slides с помощью get метода, так как это будет изменяемое событие по клику.
 * 2. Присваиваем dataset "order" для последуюего изменения порядка элементов
 * 3. Клонируем элемент .projects-slides в .clone-projects-slides
 * 4. Двигаем исходный элемент .projects-slides в указанную сторону
 * 5. Проводим сортировку слайдов в клонируемом элементе
 * 6. Заменяем слайды на сортированные в клонированном элементе
 * 7. Заменяем projects-slides клонированным с отсортированным списком Делаем replaceChild(.clone-projects-slides, .projects-slides)
 *    таким образом мы сначала перемещаем элемент, а затем перерисовываем, сохраняя видимые карточки на своих местах
 * 8. возврат к шагу №1
 */

// 4. Двигаем исходный элемент .slider-navigation в указанную сторону
// const prevButton = sliderNavigation.getElementsByClassName('slider-prev')[0];
// const nextButton = sliderNavigation.getElementsByClassName('slider-next')[0];


const prevButton = document.getElementsByClassName('slider-prev')[0];
const nextButton = document.getElementsByClassName('slider-next')[0];


let offset = 0;

// Если слайдов мало, то двигать не нужно.
function moveSlideIfPossible(){
    sliderContainer = getSliderContainer(slider);

    // собрать список слайдов 
    slides = sliderContainer.querySelectorAll('.slide-link');

    // 2. присваиваем dataset "order" для последуюего изменения порядка элементов
    for(i = 0; i < slides.length; i++){
        slides[i].dataset.order = [i];
    }
    
    clonedSliderContainer = copySliderContainer(sliderContainer);
    clonedSlides = clonedSliderContainer.querySelectorAll('.slide-link');

    const sliderContainerWidth = sliderContainer.offsetWidth;
    const overflowContainerWidth = overflowContainer.offsetWidth;

    if(overflowContainerWidth < sliderContainerWidth) {
        const slideWidth = slides[0].offsetWidth;
        const computedSlideStyle = getComputedStyle(slides[0]);
        const slideMarginLeft    = parseInt(computedSlideStyle.marginLeft) || 0;
        const slideMarginRight   = parseInt(computedSlideStyle.marginRight) || 0;
        // паддинги и бордеры надо добавить, на случай изменения css

        const fullSlideWidth = slideWidth + slideMarginLeft + slideMarginRight;
        return fullSlideWidth;
    } else {
        return false;
    } 
}


// Move slide button Logic 
function moveSlide(direction){
    
    const getOffset = moveSlideIfPossible();
    if(direction === "left"){
        if(getOffset){
            offset -= getOffset;
        } 
    } else if(direction === "right"){
        if(getOffset){
            offset += getOffset;
        } 
    } else {
        console.error("function moveSlide(direction) error");
        return;
    }
    changeOrder(direction);

    sliderContainer.style.setProperty('left', `calc(50% + ${offset}px)`);

    setTimeout(() => {
        overflowContainer.replaceChild(clonedSliderContainer, sliderContainer);
        offset = 0;
    }, 1000);

}

function activateSliderNavigation(){
    prevButton.addEventListener('click', nextSlide);
    nextButton.addEventListener('click', previousSlide);
}

function deactivateSliderNavigation(){
    prevButton.removeEventListener('click', nextSlide);
    nextButton.removeEventListener('click', previousSlide);
}


const previousSlide = () => { 
    deactivateSliderNavigation();
    moveSlide("left"); 
    setTimeout(()=>{
 
        activateSliderNavigation();
    },1000);
}
const nextSlide = () => { 
    deactivateSliderNavigation();
    moveSlide("right") 
    setTimeout(()=>{
        
        activateSliderNavigation();
    },1000);
}


activateSliderNavigation();

//#endregion




/* Сколько отработано дней на текущей работе */
//#region 

/**
 * 1. Парсим дату начала 
 * 2. Получаем сегодняшнюю дату
 * 3. Высчитываем разницу лет
 * 4. Высчитываем разницу месяцев
 * 5. определяем окончание год, года, лет в том числе 0
 * 6. определяем окончание месяц, месяца, месяцев и 0
 * 7. Заменяем текст в DOM дереве
 */ 

const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь"
];


const currentJob = document.getElementById("current-job");
const totalJobPeriodField = currentJob.querySelector(".job-period__total");
// Получаем дату начала работы
const startJobDate = currentJob.querySelector(".job-period__since");

// 1. Парсим дату начала работы
const startJobDateYear = Number(startJobDate.innerHTML.split(' ')[1]);
const startJobDateMonthString = startJobDate.innerHTML.split(' ')[0];
const startJobDateMonthIndex = months.indexOf(startJobDateMonthString);

// 2. Получаем сегодняшнюю дату:
const today = new Date;
const todayYear = today.getFullYear();
const todayMonth = today.getMonth();

// 3. Высчитываем разницу лет
const totalYears = todayYear - startJobDateYear;
// 4. Высчитываем разницу месяцев
const totalMonths = todayMonth - startJobDateMonthIndex;

// * 5. определяем окончание год, года, лет в том числе 0
function getYearSuffix(years) {
    if(years >= 5){
        return "лет";
    }
    else if (years < 5) {
        return "года";
    }
    else if (years === 1) {
        return "год";
    }
    else if (years === 0){
        return "";
    }
    else {
        console.error("Неверный год getYearSuffix(year)")
        return "";
    }
}
const yearSuffix = getYearSuffix(totalYears);

// * 6. определяем окончание месяц, месяца, месяцев и 0
function getMonthSuffix(months) {
    if(months >= 5){
        return "месяцев";
    } 
    else if(months < 5) {
        return "месяца";
    }
    else if(months === 1){
        return "месяц";
    }
    else if(months === 0) {
        return "";
    } 
    else {
        console.error("Неверный месяц getMonthSuffix(months)")
        return "";
    }
}
const monthSuffix = getMonthSuffix(totalMonths);

// объединяем строку
const totalJobPeriod = `${totalYears} ${yearSuffix} ${totalMonths} ${monthSuffix}`;

// * 7. Заменяем текст в DOM дереве
totalJobPeriodField.innerHTML = totalJobPeriod;



//#endregion





const ruleList = document.styleSheets[0].cssRules;

// for (let i = 0; i < ruleList.length; i++) {
//   console.log(ruleList[i]);
// }

