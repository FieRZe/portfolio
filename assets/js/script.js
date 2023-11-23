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
            console.log(entry.target);

            // получаем уникальный class-префикс с именем навыка
            const skillClassPrefix = entry.target.id.substring(skillIDPrefixLength);

            // из html конвертируем установленный процент прогресса навыка string в int
            const skillPercentsHtml = Number(entry.target.querySelector(".progress-number").textContent);

            // пересчёт html число в stroke-dashoffset для анимации
            const skillStrokeDashOffset = strokeDashOffsetDefault - (strokeDashOffsetDefault / 100 * skillPercentsHtml);
            
            // подготовка css стиля для добавления анимации с уникальным именем
            const skillClassRule = `.${skillClassPrefix} {
                animation: anim-${skillClassPrefix} 2s linear forwards;
            }`

            // подготовка css keyframes с уникальным именем
            const keyframesRule = `@keyframes anim-${skillClassPrefix} {
                100% {
                    stroke-dashoffset: ${skillStrokeDashOffset};
                }
            }`

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
// // В каждом навыке
// skills.forEach(skill => {
//     // получаем уникальный class-префикс с именем навыка
//     const skillClassPrefix = skill.id.substring(skillIDPrefixLength);

//     // из html конвертируем установленный процент прогресса навыка string в int
//     const skillPercentsHtml = Number(skill.querySelector(".progress-number").textContent);

//     // пересчёт html число в stroke-dashoffset для анимации
//     const skillStrokeDashOffset = strokeDashOffsetDefault - (strokeDashOffsetDefault / 100 * skillPercentsHtml);
    
//     // подготовка css стиля для добавления анимации с уникальным именем
//     const skillClassRule = `.${skillClassPrefix} {
//         animation: anim-${skillClassPrefix} 2s linear forwards 2s;
//     }`

//     // подготовка css keyframes с уникальным именем
//     const keyframesRule = `@keyframes anim-${skillClassPrefix} {
//         100% {
//             stroke-dashoffset: ${skillStrokeDashOffset};
//         }
//     }`

//     // Добавить правила в текущий style.css
//     style.insertRule(skillClassRule);
//     style.insertRule(keyframesRule);
// });

//#endregion


