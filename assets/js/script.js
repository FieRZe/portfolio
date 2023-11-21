// Текущий style.css на странице в который будем добавлять стили:
const style = window.document.styleSheets[0];

/* Увеличение процентов от нуля до указанного числа */

// Список всех skill ID и соответствующие им проценты
// {key: value}
// Ищем по ID префиксу все навыки на странице
const skillIDPrefix = "progress-circle__";
// css значение stroke-dashoffset: 127 является 100% от навыка в CSS
const strokeDashOffsetDefault = 127;

// Длина ID префикса, для substring, чтобы получить имя навыка
const skillIDPrefixLength = skillIDPrefix.length;

// Собираем все элементы с нашим ID префиксом
const skills = document.querySelectorAll(`[id^=${skillIDPrefix}]`);

// В каждом навыке
skills.forEach(skill => {
    // получаем уникальный class-префикс с именем навыка
    const skillClassPrefix = skill.id.substring(skillIDPrefixLength);

    // из html конвертируем установленный процент прогресса навыка string в int
    const skillPercentsHtml = Number(skill.querySelector(".progress-number").textContent);

    // пересчёт html число в stroke-dashoffset для анимации
    const skillStrokeDashOffset = strokeDashOffsetDefault - (strokeDashOffsetDefault / 100 * skillPercentsHtml);
    
    // подготовка css стиля для добавления анимации с уникальным именем
    const skillClassRule = `.${skillClassPrefix} {
        animation: anim-${skillClassPrefix} 2s linear forwards 2s;
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
});
