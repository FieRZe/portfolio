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
const sliderContainer = slider.getElementsByClassName('projects-slides')[0];

// собрать список слайдов из html
const defaultSlides = slider.getElementsByClassName('slide-link');
console.log(defaultSlides[0]);

// на основе html-списка создать массив, который мы будем изменять и показывать частично
const slides = [];
for(i = 0; i < defaultSlides.length; i++){
    slides.push(defaultSlides[i]);

    // очищаем существующий список
    //defaultSlides[i].remove();
}


let offset = 0;

const sliderNavigation = document.getElementsByClassName('slider-navigation')[0];

const prevButton = sliderNavigation.getElementsByClassName('slider-prev')[0];
const nextButton = sliderNavigation.getElementsByClassName('slider-next')[0];


// Если слайдов мало, то двигать не нужно.
function moveSlideIfPossible(){
    const sliderContainerWidth = sliderContainer.offsetWidth;
    const overflowContainerWidth = overflowContainer.offsetWidth;
    
    if(overflowContainerWidth < sliderContainerWidth) {
        const slideWidth = parseInt(slides[0].offsetWidth) || 0;
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


// Previous Button logic
function previousSlide() {
    const getOffset = moveSlideIfPossible();
    if(getOffset){
        offset -= getOffset;
        sliderContainer.style.setProperty('left', `calc(50% + ${offset}px)`);
    } 
}

// Next Button logic
function nextSlide() {
    const getOffset = moveSlideIfPossible();
    if(getOffset){
        offset += getOffset;
        sliderContainer.style.setProperty('left', `calc(50% + ${offset}px)`);
    } 
}

prevButton.addEventListener('click', previousSlide);
nextButton.addEventListener('click', nextSlide);



// Next



//#endregion




const ruleList = document.styleSheets[0].cssRules;

// for (let i = 0; i < ruleList.length; i++) {
//   console.log(ruleList[i]);
// }

