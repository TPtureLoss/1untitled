/* =====================================================
   UNTITLED
   SCRIPT.JS — PART 1 / 5
   CORE + WORD SELECTION + RECEIPT
===================================================== */


/* =====================================================
   1. DOM 基础
===================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* =================================================
       2. 获取元素
    ================================================= */

    const site =
        document.querySelector("#site");

    const scenes =
        Array.from(
            document.querySelectorAll(".scene, .life-section")
        );

    const wordButtons =
        Array.from(
            document.querySelectorAll(".word-button")
        );

    const receiptItems =
        document.querySelector("#receiptItems");

    const receiptEmpty =
        document.querySelector("#receiptEmpty");

    const receiptTotal =
        document.querySelector("#receiptTotal");

    const selectionStatus =
        document.querySelector("#selectionStatus");

    const fallingReceipt =
        document.querySelector("#fallingReceipt");

    const fallingReceiptWords =
        document.querySelector("#fallingReceiptWords");

    const leafEntry =
        document.querySelector("#leafEntry");

    const disappearMessage =
        document.querySelector("#disappearMessage");

    const waterRipple =
        document.querySelector("#waterRipple");

    const finalLeaf =
        document.querySelector("#finalLeaf");

    const endingText =
        document.querySelector("#endingText");

    const progressBar =
        document.querySelector(
            "#pageProgress span"
        );


    /* =================================================
       3. 全局状态
    ================================================= */

    const state = {

        selectedWords: [],

        currentPage: 0,

        isAnimating: false,

        touchStartY: 0,

        touchEndY: 0,

        pageCount:
            scenes.length

    };


    /* =================================================
       4. 词语分类
    ================================================= */

    const wordCategories = {

        personality: [

            "开朗的",
            "安静的",
            "独立的",
            "温柔的",
            "敏感的",
            "理性的",
            "感性的",
            "自由的",
            "勇敢的",
            "慢热的",
            "浪漫的",
            "真诚的",
            "细腻的",
            "坚定的",
            "随性的",
            "克制的",
            "好奇的",
            "热烈的",
            "孤独的",
            "清醒的",
            "善良的",
            "叛逆的",
            "谨慎的",
            "乐观的",
            "悲观的",
            "执着的",
            "洒脱的",
            "复杂的",
            "简单的",
            "矛盾的"

        ],

        appearance: [

            "清秀的",
            "锋利的",
            "柔和的",
            "明亮的",
            "冷淡的",
            "干净的",
            "慵懒的",
            "随意的",
            "精致的",
            "自然的",
            "特别的",
            "普通的",
            "独特的",
            "朴素的",
            "醒目的"

        ],

        identity: [

            "自由的",
            "迷茫的",
            "寻找中的",
            "成长中的",
            "观察者",
            "思考者",
            "旁观者",
            "参与者",
            "旅行者",
            "理想主义者",
            "现实主义者",
            "孤独的旅人"

        ]

    };


    /* =================================================
       5. 合并所有词语
    ================================================= */

    const allWords = [

        ...wordCategories.personality,

        ...wordCategories.appearance,

        ...wordCategories.identity

    ];


    /* =================================================
       6. 随机排列
    ================================================= */

    function shuffle(array) {

        const result =
            [...array];

        for (
            let i = result.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() * (i + 1)
                );

            [
                result[i],
                result[j]
            ] =
            [
                result[j],
                result[i]
            ];

        }

        return result;

    }


    /* =================================================
       7. 如果 HTML 中没有词语，
          自动生成词语按钮
    ================================================= */

    function createWordButtons() {

        const field =
            document.querySelector(
                "#wordField"
            );

        if (!field) return;


        /*
         * 防止重复生成
         */

        if (
            field.children.length > 0
        ) {

            return;

        }


        const words =
            shuffle(allWords);


        words.forEach(
            (word, index) => {

                const button =
                    document.createElement(
                        "button"
                    );

                button.type =
                    "button";

                button.className =
                    "word-button";

                button.dataset.word =
                    word;

                button.textContent =
                    word;

                button.style.setProperty(
                    "--index",
                    index
                );

                field.appendChild(
                    button
                );

            }
        );

    }


    /* =================================================
       8. 初始化词语
    ================================================= */

    createWordButtons();


    /* =================================================
       9. 重新获取词语按钮
    ================================================= */

    function getCurrentWordButtons() {

        return Array.from(
            document.querySelectorAll(
                ".word-button"
            )
        );

    }


    /* =================================================
       10. 选择 / 取消选择
    ================================================= */

    function toggleWord(button) {

        const word =
            button.dataset.word ||
            button.textContent.trim();


        const index =
            state.selectedWords.indexOf(
                word
            );


        if (index === -1) {

            /*
             * 选择
             */

            state.selectedWords.push(
                word
            );

            button.classList.add(
                "selected"
            );

        } else {

            /*
             * 取消选择
             */

            state.selectedWords.splice(
                index,
                1
            );

            button.classList.remove(
                "selected"
            );

        }


        updateSelectionStatus();

        updateReceipt();

    }


    /* =================================================
       11. 词语点击
    ================================================= */

    document.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    ".word-button"
                );

            if (!button) return;

            toggleWord(button);

        }
    );


    /* =================================================
       12. 更新选择数量
    ================================================= */

    function updateSelectionStatus() {

        if (!selectionStatus) {
            return;
        }


        const count =
            state.selectedWords.length;


        if (count === 0) {

            selectionStatus.textContent =
                "0 WORDS SELECTED";

        } else {

            selectionStatus.textContent =
                `${count} WORD${count === 1 ? "" : "S"} SELECTED`;

        }

    }


    /* =================================================
       13. 初始化选择数量
    ================================================= */

    updateSelectionStatus();


    /* =================================================
       14. 生成小票
    ================================================= */

    function updateReceipt() {

        if (!receiptItems) {
            return;
        }


        receiptItems.innerHTML =
            "";


        const selected =
            state.selectedWords;


        /*
         * 没有选择
         */

        if (
            selected.length === 0
        ) {

            if (receiptEmpty) {

                receiptEmpty.hidden =
                    false;

                receiptEmpty.textContent =
                    "我 似乎有点不同";

                receiptItems.appendChild(
                    receiptEmpty
                );

            }

            if (receiptTotal) {

                receiptTotal.textContent =
                    "TOTAL / 0";

            }

            return;

        }


        /*
         * 有选择
         */

        if (receiptEmpty) {

            receiptEmpty.hidden =
                true;

        }


        selected.forEach(
            (word, index) => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "receipt-item";


                const number =
                    document.createElement(
                        "span"
                    );

                number.className =
                    "receipt-item-number";

                number.textContent =
                    String(
                        index + 1
                    ).padStart(
                        2,
                        "0"
                    );


                const wordElement =
                    document.createElement(
                        "span"
                    );

                wordElement.className =
                    "receipt-item-word";

                wordElement.textContent =
                    word;


                const mark =
                    document.createElement(
                        "span"
                    );

                mark.className =
                    "receipt-item-mark";

                mark.textContent =
                    "✓";


                item.appendChild(
                    number
                );

                item.appendChild(
                    wordElement
                );

                item.appendChild(
                    mark
                );


                receiptItems.appendChild(
                    item
                );

            }
        );


        if (receiptTotal) {

            receiptTotal.textContent =
                `TOTAL / ${selected.length}`;

        }

    }


    /* =================================================
       15. 初始化小票
    ================================================= */

    updateReceipt();


    /* =================================================
       16. 把小票内容复制到落水小票
    ================================================= */

    function updateFallingReceipt() {

        if (
            !fallingReceiptWords
        ) {

            return;

        }


        fallingReceiptWords.innerHTML =
            "";


        if (
            state.selectedWords.length === 0
        ) {

            const empty =
                document.createElement(
                    "div"
                );

            empty.textContent =
                "我 似乎有点不同";

            empty.style.textAlign =
                "center";

            fallingReceiptWords.appendChild(
                empty
            );

            return;

        }


        state.selectedWords.forEach(
            (word, index) => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "falling-word";


                item.innerHTML = `
                    <span>
                        ${String(index + 1).padStart(2, "0")}
                    </span>

                    <span>
                        ${escapeHTML(word)}
                    </span>
                `;


                fallingReceiptWords.appendChild(
                    item
                );

            }
        );

    }


    /* =================================================
       17. HTML 安全处理
    ================================================= */

    function escapeHTML(value) {

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =================================================
       18. 页面索引
    ================================================= */

    function getSceneIndex(
        element
    ) {

        return scenes.indexOf(
            element
        );

    }


    /* =================================================
       19. 页面滚动
    ================================================= */

    function goToPage(
        index,
        smooth = true
    ) {

        if (
            index < 0 ||
            index >= state.pageCount
        ) {

            return;

        }


        const target =
            scenes[index];


        if (!target) {
            return;
        }


        state.currentPage =
            index;


        target.scrollIntoView({

            behavior:
                smooth
                    ? "smooth"
                    : "auto",

            block:
                "start"

        });

    }


    /* =================================================
       20. 初始化当前页面
    ================================================= */

    function updateCurrentPage() {

        const scrollPosition =
            window.scrollY +
            window.innerHeight * 0.45;


        let closestIndex =
            state.currentPage;


        let closestDistance =
            Infinity;


        scenes.forEach(
            (scene, index) => {

                const top =
                    scene.offsetTop;

                const distance =
                    Math.abs(
                        scrollPosition -
                        top
                    );


                if (
                    distance <
                    closestDistance
                ) {

                    closestDistance =
                        distance;

                    closestIndex =
                        index;

                }

            }
        );


        state.currentPage =
            closestIndex;

    }


    /* =================================================
       21. 暴露给后续代码
    ================================================= */

    window.UntitledApp = {

        state,

        scenes,

        goToPage,

        updateCurrentPage,

        updateReceipt,

        updateFallingReceipt

    };


});


/* =====================================================
   UNTITLED
   SCRIPT.JS — PART 2 / 5
   FULL PAGE SCROLL CONTROLLER
===================================================== */


document.addEventListener("DOMContentLoaded", () => {


    /* =================================================
       1. 获取核心状态
    ================================================= */

    const app =
        window.UntitledApp;

    if (!app) {
        return;
    }


    const {
        state,
        scenes,
        goToPage
    } = app;


    /* =================================================
       2. 滚动锁
    ================================================= */

    let scrollLocked =
        false;


    let scrollTimer =
        null;


    /* =================================================
       3. 判断是否正在滚动
    ================================================= */

    function lockScroll() {

        scrollLocked =
            true;


        clearTimeout(
            scrollTimer
        );


        scrollTimer =
            setTimeout(
                () => {

                    scrollLocked =
                        false;

                },
                850
            );

    }


    /* =================================================
       4. 滚轮控制
    ================================================= */

    window.addEventListener(
        "wheel",
        (event) => {


            /*
             * 小滚动不处理
             */

            if (
                Math.abs(
                    event.deltaY
                ) < 15
            ) {

                return;

            }


            /*
             * 如果正在锁定，
             * 阻止继续翻页
             */

            if (scrollLocked) {

                event.preventDefault();

                return;

            }


            /*
             * 阻止浏览器原生滚动
             */

            event.preventDefault();


            lockScroll();


            if (
                event.deltaY > 0
            ) {

                goToPage(
                    state.currentPage + 1
                );

            } else {

                goToPage(
                    state.currentPage - 1
                );

            }

        },
        {
            passive: false
        }
    );


    /* =================================================
       5. Touch 开始
    ================================================= */

    window.addEventListener(
        "touchstart",
        (event) => {

            if (
                !event.touches ||
                !event.touches.length
            ) {

                return;

            }


            state.touchStartY =
                event.touches[0].clientY;

        },
        {
            passive: true
        }
    );


    /* =================================================
       6. Touch 结束
    ================================================= */

    window.addEventListener(
        "touchend",
        (event) => {

            if (
                !event.changedTouches ||
                !event.changedTouches.length
            ) {

                return;

            }


            state.touchEndY =
                event.changedTouches[0].clientY;


            const distance =
                state.touchStartY -
                state.touchEndY;


            /*
             * 滑动距离太小，
             * 当作普通触摸
             */

            if (
                Math.abs(distance) < 45
            ) {

                return;

            }


            if (scrollLocked) {
                return;
            }


            lockScroll();


            if (distance > 0) {

                /*
                 * 向上滑手指
                 * 页面向下
                 */

                goToPage(
                    state.currentPage + 1
                );

            } else {

                /*
                 * 向下滑手指
                 * 页面向上
                 */

                goToPage(
                    state.currentPage - 1
                );

            }

        },
        {
            passive: true
        }
    );


    /* =================================================
       7. 键盘控制
    ================================================= */

    window.addEventListener(
        "keydown",
        (event) => {


            /*
             * 输入框内不触发翻页
             */

            const tag =
                document.activeElement
                    ?.tagName
                    ?.toLowerCase();


            if (
                tag === "input" ||
                tag === "textarea" ||
                tag === "select"
            ) {

                return;

            }


            if (scrollLocked) {

                return;

            }


            let direction =
                0;


            switch (
                event.key
            ) {


                case "ArrowDown":

                case "PageDown":

                case " ":

                    direction =
                        1;

                    break;


                case "ArrowUp":

                case "PageUp":

                    direction =
                        -1;

                    break;


                case "Home":

                    event.preventDefault();

                    lockScroll();

                    goToPage(
                        0
                    );

                    return;


                case "End":

                    event.preventDefault();

                    lockScroll();

                    goToPage(
                        state.pageCount - 1
                    );

                    return;


                default:

                    return;

            }


            event.preventDefault();


            lockScroll();


            goToPage(
                state.currentPage +
                direction
            );

        }
    );


    /* =================================================
       8. 浏览器原生滚动修正
    ================================================= */

    let lastScrollY =
        window.scrollY;


    let correcting =
        false;


    window.addEventListener(
        "scroll",
        () => {


            if (correcting) {
                return;
            }


            /*
             * 更新当前页面
             */

            app.updateCurrentPage();


            lastScrollY =
                window.scrollY;

        },
        {
            passive: true
        }
    );


    /* =================================================
       9. 页面初始化
    ================================================= */

    requestAnimationFrame(
        () => {

            app.updateCurrentPage();

        }
    );


    /* =================================================
       10. 鼠标移动辅助
    ================================================= */

    let mouseX =
        window.innerWidth / 2;


    let mouseY =
        window.innerHeight / 2;


    window.addEventListener(
        "mousemove",
        (event) => {

            mouseX =
                event.clientX;

            mouseY =
                event.clientY;

            document.documentElement.style.setProperty(
                "--mouse-x",
                `${mouseX}px`
            );

            document.documentElement.style.setProperty(
                "--mouse-y",
                `${mouseY}px`
            );

        },
        {
            passive: true
        }
    );


    /* =================================================
       11. 鼠标轻微视差
    ================================================= */

    function applyMouseParallax() {

        const activeScene =
            scenes[
                state.currentPage
            ];


        if (!activeScene) {
            return;
        }


        const art =
            activeScene.querySelector(
                ".environment-art"
            );


        if (!art) {
            return;
        }


        /*
         * 手机端不做鼠标视差
         */

        if (
            window.innerWidth <= 768
        ) {

            return;

        }


        const centerX =
            window.innerWidth / 2;


        const centerY =
            window.innerHeight / 2;


        const offsetX =
            (mouseX - centerX) /
            centerX;


        const offsetY =
            (mouseY - centerY) /
            centerY;


        const moveX =
            offsetX * 8;


        const moveY =
            offsetY * 8;


        art.style.setProperty(
            "--parallax-x",
            `${moveX}px`
        );

        art.style.setProperty(
            "--parallax-y",
            `${moveY}px`
        );

    }


    /* =================================================
       12. 持续更新
    ================================================= */

    function animationLoop() {

        applyMouseParallax();

        requestAnimationFrame(
            animationLoop
        );

    }


    animationLoop();


    /* =================================================
       13. 暴露滚动控制
    ================================================= */

    app.scrollController = {

        lockScroll,

        get scrollLocked() {

            return scrollLocked;

        }

    };


});


/* =====================================================
   UNTITLED
   SCRIPT.JS — PART 3 / 5
   SCENE ANIMATION CONTROLLER
===================================================== */


document.addEventListener("DOMContentLoaded", () => {


    /* =================================================
       1. 获取应用
    ================================================= */

    const app =
        window.UntitledApp;

    if (!app) {
        return;
    }


    const {
        state,
        scenes,
        updateFallingReceipt
    } = app;


    /* =================================================
       2. 获取页面元素
    ================================================= */

    const fallingReceipt =
        document.querySelector(
            "#fallingReceipt"
        );


    const fallingReceiptWords =
        document.querySelector(
            "#fallingReceiptWords"
        );


    const leafEntry =
        document.querySelector(
            "#leafEntry"
        );


    const disappearMessage =
        document.querySelector(
            "#disappearMessage"
        );


    const waterRipple =
        document.querySelector(
            "#waterRipple"
        );


    const finalLeaf =
        document.querySelector(
            "#finalLeaf"
        );


    const endingText =
        document.querySelector(
            "#endingText"
        );


    const transition =
        document.querySelector(
            ".page-transition"
        );


    /* =================================================
       3. 页面激活状态
    ================================================= */

    let activatedScenes =
        new Set();


    /* =================================================
       4. 找到指定场景
    ================================================= */

    function findScene(
        selector
    ) {

        return document.querySelector(
            selector
        );

    }


    /* =================================================
       5. 清除动画 class
    ================================================= */

    function resetAnimationClasses(
        element
    ) {

        if (!element) {
            return;
        }


        element.classList.remove(
            "active",
            "visible",
            "falling",
            "wet",
            "floating",
            "brown",
            "fade",
            "landed",
            "fading",
            "journey-green",
            "journey-darkgreen",
            "journey-brown",
            "journey-darkbrown",
            "journey-faded"
        );

    }


    /* =================================================
       6. 第一页
    ================================================= */

    function activateOpening() {

        const scene =
            findScene(
                "#scene-1"
            );


        if (!scene) {
            return;
        }


        scene.classList.add(
            "active"
        );

    }


    /* =================================================
       7. 第二页
    ================================================= */

    function activateWords() {

        const scene =
            findScene(
                "#scene-2"
            );


        if (!scene) {
            return;
        }


        scene.classList.add(
            "active"
        );

    }


    /* =================================================
       8. 第三页：小票
    ================================================= */

    function activateReceipt() {

        const scene =
            findScene(
                "#scene-3"
            );


        if (!scene) {
            return;
        }


        scene.classList.add(
            "active"
        );


        /*
         * 每次进入第三页，
         * 确保小票内容是最新的
         */

        if (
            typeof updateFallingReceipt ===
            "function"
        ) {

            updateFallingReceipt();

        }

    }


    /* =================================================
       9. 第四页：小票落水
    ================================================= */

    function activateWaterScene() {

        const scene =
            findScene(
                "#scene-4"
            );


        if (!scene) {
            return;
        }


        scene.classList.add(
            "active"
        );


        /*
         * 小票开始掉落
         */

        if (fallingReceipt) {

            resetAnimationClasses(
                fallingReceipt
            );

            updateFallingReceipt();

            void fallingReceipt.offsetWidth;

            fallingReceipt.classList.add(
                "falling"
            );

        }


        /*
         * 延迟湿掉
         */

        setTimeout(
            () => {

                if (
                    fallingReceipt
                ) {

                    fallingReceipt.classList.add(
                        "wet"
                    );

                }

            },
            1900
        );


        /*
         * 涟漪
         */

        setTimeout(
            () => {

                if (!waterRipple) {
                    return;
                }


                waterRipple.classList.remove(
                    "active"
                );


                void waterRipple.offsetWidth;


                waterRipple.classList.add(
                    "active"
                );

            },
            2350
        );


        /*
         * 小票消失
         */

        setTimeout(
            () => {

                if (
                    fallingReceipt
                ) {

                    fallingReceipt.style.opacity =
                        "0";

                }

            },
            3000
        );


        /*
         * 树叶出现
         */

        setTimeout(
            () => {

                if (!leafEntry) {
                    return;
                }


                leafEntry.classList.add(
                    "visible"
                );

                leafEntry.classList.add(
                    "floating"
                );

            },
            3400
        );


        /*
         * 文字出现
         */

        setTimeout(
            () => {

                if (
                    disappearMessage
                ) {

                    disappearMessage.style.opacity =
                        "1";

                    disappearMessage.style.transform =
                        "translateX(-50%) translateY(0)";

                    disappearMessage.style.transition =
                        "opacity 1.8s ease, transform 1.8s ease";

                }

            },
            3800
        );

    }


    /* =================================================
       10. 人生章节
    ================================================= */

    function activateLifeScene(
        scene,
        index
    ) {

        if (!scene) {
            return;
        }


        scene.classList.add(
            "active"
        );


        /*
         * 根据章节决定叶子颜色
         */

        updateLeafJourney(
            index
        );


        /*
         * 让中央线稿重新播放
         */

        const art =
            scene.querySelector(
                ".environment-art"
            );


        if (art) {

            art.classList.remove(
                "drawing"
            );

            void art.offsetWidth;

            art.classList.add(
                "drawing"
            );

        }

    }


    /* =================================================
       11. 树叶旅程颜色
    ================================================= */

    function updateLeafJourney(
        index
    ) {

        if (!leafEntry) {
            return;
        }


        leafEntry.classList.remove(
            "journey-green",
            "journey-darkgreen",
            "journey-brown",
            "journey-darkbrown",
            "journey-faded"
        );


        /*
         * 第五页
         * 天空
         */

        if (index === 4) {

            leafEntry.classList.add(
                "journey-green"
            );

            return;

        }


        /*
         * 第六页
         * 飞鸟
         */

        if (index === 5) {

            leafEntry.classList.add(
                "journey-darkgreen"
            );

            return;

        }


        /*
         * 第七页
         * 枯木
         */

        if (index === 6) {

            leafEntry.classList.add(
                "journey-brown"
            );

            return;

        }


        /*
         * 第八页
         * 流水
         */

        if (index === 7) {

            leafEntry.classList.add(
                "journey-darkbrown"
            );

            return;

        }


        /*
         * 第九页
         * 你
         */

        if (index === 8) {

            leafEntry.classList.add(
                "journey-faded"
            );

        }

    }


    /* =================================================
       12. 最终页面
    ================================================= */

    function activateEnding() {

        const scene =
            findScene(
                "#scene-10"
            );


        if (!scene) {
            return;
        }


        scene.classList.add(
            "active"
        );


        /*
         * 让树叶进入最终状态
         */

        if (leafEntry) {

            leafEntry.classList.remove(
                "floating"
            );

            leafEntry.classList.add(
                "journey-faded"
            );

        }


        /*
         * 独立的最终树叶
         */

        if (finalLeaf) {

            finalLeaf.classList.remove(
                "landed",
                "fading"
            );


            void finalLeaf.offsetWidth;


            finalLeaf.classList.add(
                "falling"
            );


            setTimeout(
                () => {

                    finalLeaf.classList.add(
                        "landed"
                    );

                },
                4100
            );


            setTimeout(
                () => {

                    finalLeaf.classList.add(
                        "fading"
                    );

                },
                4700
            );

        }


        /*
         * 最终文字
         */

        if (endingText) {

            endingText.classList.remove(
                "visible"
            );


            setTimeout(
                () => {

                    endingText.classList.add(
                        "visible"
                    );

                },
                6100
            );

        }

    }


    /* =================================================
       13. 页面动画总控制器
    ================================================= */

    function activateScene(
        index
    ) {

        if (
            index < 0 ||
            index >= scenes.length
        ) {

            return;

        }


        const scene =
            scenes[index];


        if (!scene) {
            return;
        }


        /*
         * 记录已经进入过的页面
         */

        activatedScenes.add(
            index
        );


        /*
         * 第一页
         */

        if (index === 0) {

            activateOpening();

            return;

        }


        /*
         * 第二页
         */

        if (index === 1) {

            activateWords();

            return;

        }


        /*
         * 第三页
         */

        if (index === 2) {

            activateReceipt();

            return;

        }


        /*
         * 第四页
         */

        if (index === 3) {

            activateWaterScene();

            return;

        }


        /*
         * 第五～九页
         */

        if (
            index >= 4 &&
            index <= 8
        ) {

            activateLifeScene(
                scene,
                index
            );

            return;

        }


        /*
         * 第十页
         */

        if (index === 9) {

            activateEnding();

        }

    }


    /* =================================================
       14. 页面变化监听
    ================================================= */

    let lastPage =
        -1;


    function checkPageChange() {

        const currentPage =
            state.currentPage;


        if (
            currentPage === lastPage
        ) {

            requestAnimationFrame(
                checkPageChange
            );

            return;

        }


        lastPage =
            currentPage;


        activateScene(
            currentPage
        );


        requestAnimationFrame(
            checkPageChange
        );

    }


    /* =================================================
       15. 开始监听
    ================================================= */

    checkPageChange();


    /* =================================================
       16. 初始化第一页
    ================================================= */

    activateScene(
        state.currentPage
    );


    /* =================================================
       17. 页面过渡效果
    ================================================= */

    function triggerTransition() {

        if (!transition) {
            return;
        }


        transition.classList.remove(
            "active"
        );


        void transition.offsetWidth;


        transition.classList.add(
            "active"
        );

    }


    /* =================================================
       18. 暴露给其他模块
    ================================================= */

    app.sceneController = {

        activateScene,

        activateLifeScene,

        activateEnding,

        updateLeafJourney,

        triggerTransition

    };


});


/* =====================================================
   UNTITLED
   SCRIPT.JS — PART 4 / 5
   CONTINUOUS LEAF JOURNEY
===================================================== */


document.addEventListener("DOMContentLoaded", () => {


    /* =================================================
       1. 获取应用
    ================================================= */

    const app =
        window.UntitledApp;

    if (!app) {
        return;
    }


    const {
        state,
        scenes
    } = app;


    /* =================================================
       2. 获取树叶
    ================================================= */

    const leaf =
        document.querySelector(
            "#leafEntry"
        );


    if (!leaf) {
        return;
    }


    /* =================================================
       3. 树叶旅程状态
    ================================================= */

    const leafJourney = {

        active:
            false,

        progress:
            0,

        targetProgress:
            0,

        currentRotation:
            -10,

        targetRotation:
            -10,

        startPage:
            4,

        endPage:
            8,

        colorIndex:
            0,

        initialized:
            false

    };


    /* =================================================
       4. 树叶颜色
    ================================================= */

    const leafColors = [

        {
            body:
                "#718765",

            stroke:
                "#52644c"
        },

        {
            body:
                "#63765a",

            stroke:
                "#4e6048"
        },

        {
            body:
                "#806a54",

            stroke:
                "#665340"
        },

        {
            body:
                "#675849",

            stroke:
                "#514438"
        },

        {
            body:
                "#aaa79e",

            stroke:
                "#8f8c84"
        }

    ];


    /* =================================================
       5. 获取叶片 SVG
    ================================================= */

    const leafBody =
        leaf.querySelector(
            ".leaf-body"
        );


    const leafVeins =
        leaf.querySelectorAll(
            ".leaf-vein"
        );


    /* =================================================
       6. 设置颜色
    ================================================= */

    function setLeafColor(
        progress
    ) {

        if (!leafBody) {
            return;
        }


        /*
         * progress:
         *
         * 0
         * ↓
         * 1
         */


        const scaled =
            progress *
            (
                leafColors.length - 1
            );


        const index =
            Math.min(
                Math.floor(scaled),
                leafColors.length - 1
            );


        const nextIndex =
            Math.min(
                index + 1,
                leafColors.length - 1
            );


        const amount =
            scaled -
            index;


        const current =
            leafColors[index];


        const next =
            leafColors[nextIndex];


        /*
         * 简单颜色插值
         */

        const body =
            interpolateColor(
                current.body,
                next.body,
                amount
            );


        const stroke =
            interpolateColor(
                current.stroke,
                next.stroke,
                amount
            );


        leafBody.style.fill =
            body;

        leafBody.style.stroke =
            stroke;


        leafVeins.forEach(
            vein => {

                vein.style.stroke =
                    interpolateColor(
                        "#f1f1e7",
                        "#ded8ca",
                        progress
                    );

            }
        );

    }


    /* =================================================
       7. 十六进制颜色插值
    ================================================= */

    function interpolateColor(
        colorA,
        colorB,
        amount
    ) {

        const a =
            hexToRGB(colorA);

        const b =
            hexToRGB(colorB);


        const r =
            Math.round(
                a.r +
                (
                    b.r - a.r
                ) *
                amount
            );


        const g =
            Math.round(
                a.g +
                (
                    b.g - a.g
                ) *
                amount
            );


        const blue =
            Math.round(
                a.b +
                (
                    b.b - a.b
                ) *
                amount
            );


        return `
            rgb(
                ${r},
                ${g},
                ${blue}
            )
        `;

    }


    /* =================================================
       8. HEX → RGB
    ================================================= */

    function hexToRGB(
        hex
    ) {

        const value =
            hex.replace(
                "#",
                ""
            );


        return {

            r:
                parseInt(
                    value.substring(0, 2),
                    16
                ),

            g:
                parseInt(
                    value.substring(2, 4),
                    16
                ),

            b:
                parseInt(
                    value.substring(4, 6),
                    16
                )

        };

    }


    /* =================================================
       9. 计算页面进度
    ================================================= */

    function calculateJourneyProgress() {

        const currentPage =
            state.currentPage;


        /*
         * 第五页之前
         */

        if (
            currentPage <
            leafJourney.startPage
        ) {

            return 0;

        }


        /*
         * 第九页之后
         */

        if (
            currentPage >
            leafJourney.endPage
        ) {

            return 1;

        }


        /*
         * 五页之间的连续进度
         */

        const progress =
            (
                currentPage -
                leafJourney.startPage
            )
            /
            (
                leafJourney.endPage -
                leafJourney.startPage
            );


        return Math.max(
            0,
            Math.min(
                1,
                progress
            )
        );

    }


    /* =================================================
       10. 根据页面计算目标位置
    ================================================= */

    function calculateLeafPosition(
        progress
    ) {

        /*
         * 叶子始终在中央轨迹附近，
         * 但不会机械地保持绝对不动。
         */

        const wave =
            Math.sin(
                progress *
                Math.PI *
                4
            );


        const waveSmall =
            Math.sin(
                progress *
                Math.PI *
                8
            );


        /*
         * 左右摆动幅度
         */

        const x =
            wave *
            30
            +
            waveSmall *
            8;


        /*
         * 从上方向下
         */

        const y =
            -8 +
            progress *
            116;


        return {

            x,

            y

        };

    }


    /* =================================================
       11. 根据进度计算旋转
    ================================================= */

    function calculateLeafRotation(
        progress
    ) {

        const rotation =
            Math.sin(
                progress *
                Math.PI *
                5
            )
            *
            32;


        const secondary =
            Math.sin(
                progress *
                Math.PI *
                11
            )
            *
            9;


        return (
            -10 +
            rotation +
            secondary
        );

    }


    /* =================================================
       12. 树叶缩放
    ================================================= */

    function calculateLeafScale(
        progress
    ) {

        /*
         * 前段稍微靠近，
         * 后段稍微远离。
         */

        if (
            progress < .5
        ) {

            return (
                1 +
                progress *
                .08
            );

        }


        return (
            1.04 -
            (
                progress -
                .5
            )
            *
            .08
        );

    }


    /* =================================================
       13. 树叶透明度
    ================================================= */

    function calculateLeafOpacity(
        progress
    ) {

        /*
         * 到第九页后开始明显褪色
         */

        if (
            progress < .78
        ) {

            return 1;

        }


        const fade =
            (
                progress -
                .78
            )
            /
            .22;


        return (
            1 -
            fade *
            .72
        );

    }


    /* =================================================
       14. 应用树叶状态
    ================================================= */

    function renderLeaf() {

        const progress =
            leafJourney.progress;


        const position =
            calculateLeafPosition(
                progress
            );


        const rotation =
            calculateLeafRotation(
                progress
            );


        const scale =
            calculateLeafScale(
                progress
            );


        const opacity =
            calculateLeafOpacity(
                progress
            );


        leaf.style.opacity =
            opacity;


        leaf.style.transform = `
            translate(
                calc(-50% + ${position.x}px),
                calc(-50% + ${position.y}vh)
            )
            rotate(${rotation}deg)
            scale(${scale})
        `;


        setLeafColor(
            progress
        );

    }


    /* =================================================
       15. 平滑动画
    ================================================= */

    function animateLeaf() {

        /*
         * 当前进度逐渐接近目标进度
         */

        leafJourney.progress +=
            (
                leafJourney.targetProgress -
                leafJourney.progress
            )
            *
            .08;


        renderLeaf();


        requestAnimationFrame(
            animateLeaf
        );

    }


    /* =================================================
       16. 更新目标进度
    ================================================= */

    function updateLeafTarget() {

        const currentPage =
            state.currentPage;


        /*
         * 第四页：
         * 树叶刚刚出现
         */

        if (
            currentPage === 3
        ) {

            leafJourney.active =
                true;

            leafJourney.targetProgress =
                0;


            leaf.style.opacity =
                1;


            return;

        }


        /*
         * 第五～九页：
         * 连续移动
         */

        if (
            currentPage >= 4 &&
            currentPage <= 8
        ) {

            leafJourney.active =
                true;


            leafJourney.targetProgress =
                calculateJourneyProgress();


            return;

        }


        /*
         * 第十页：
         * 离开旅程
         */

        if (
            currentPage === 9
        ) {

            leafJourney.targetProgress =
                1;

        }

    }


    /* =================================================
       17. 页面变化检测
    ================================================= */

    let previousPage =
        -1;


    function watchPage() {

        const currentPage =
            state.currentPage;


        if (
            currentPage !==
            previousPage
        ) {

            previousPage =
                currentPage;


            updateLeafTarget();

        }


        requestAnimationFrame(
            watchPage
        );

    }


    /* =================================================
       18. 初始化
    ================================================= */

    leafJourney.progress =
        0;


    leafJourney.targetProgress =
        0;


    setLeafColor(
        0
    );


    renderLeaf();


    /* =================================================
       19. 开始动画
    ================================================= */

    animateLeaf();


    /* =================================================
       20. 开始监听
    ================================================= */

    watchPage();


    /* =================================================
       21. 暴露控制器
    ================================================= */

    app.leafController = {

        update:
            updateLeafTarget,

        render:
            renderLeaf,

        getProgress() {

            return leafJourney.progress;

        }

    };


});


/* =====================================================
   UNTITLED
   SCRIPT.JS — PART 5 / 5
   FINALIZATION + PROGRESS + SAFETY
===================================================== */


document.addEventListener("DOMContentLoaded", () => {


    /* =================================================
       1. 获取应用
    ================================================= */

    const app =
        window.UntitledApp;

    if (!app) {
        return;
    }


    const {
        state,
        scenes
    } = app;


    /* =================================================
       2. 页面进度
    ================================================= */

    const progressBar =
        document.querySelector(
            "#pageProgress span"
        );


    const progressNumber =
        document.querySelector(
            "#pageProgressNumber"
        );


    function updateProgress() {

        if (
            !scenes ||
            scenes.length === 0
        ) {

            return;

        }


        const current =
            state.currentPage;


        const total =
            scenes.length;


        const percentage =
            (
                current /
                Math.max(
                    total - 1,
                    1
                )
            )
            *
            100;


        if (progressBar) {

            progressBar.style.width =
                `${percentage}%`;

        }


        if (progressNumber) {

            progressNumber.textContent =
                String(
                    current + 1
                ).padStart(
                    2,
                    "0"
                );

        }

    }


    /* =================================================
       3. 页面变化监听
    ================================================= */

    let previousPage =
        state.currentPage;


    function progressLoop() {

        if (
            state.currentPage !==
            previousPage
        ) {

            previousPage =
                state.currentPage;

            updateProgress();

        }


        requestAnimationFrame(
            progressLoop
        );

    }


    updateProgress();

    progressLoop();


    /* =================================================
       4. 最终页文字
    ================================================= */

    const endingText =
        document.querySelector(
            "#endingText"
        );


    function prepareEndingText() {

        if (!endingText) {
            return;
        }


        /*
         * 如果 HTML 没有内容，
         * 自动补上最终文案。
         */

        if (
            endingText.textContent.trim()
                .length === 0
        ) {

            endingText.innerHTML = `
                <p>我普通</p >
                <p>可是我是唯一一个我</p >
            `;

        }

    }


    prepareEndingText();


    /* =================================================
       5. 第十页最终状态
    ================================================= */

    let endingPlayed =
        false;


    function checkEnding() {

        if (
            state.currentPage !== 9
        ) {

            return;

        }


        if (endingPlayed) {
            return;
        }


        endingPlayed =
            true;


        const finalLeaf =
            document.querySelector(
                "#finalLeaf"
            );


        if (finalLeaf) {

            finalLeaf.classList.remove(
                "falling",
                "landed",
                "fading"
            );


            void finalLeaf.offsetWidth;


            finalLeaf.classList.add(
                "falling"
            );


            setTimeout(
                () => {

                    finalLeaf.classList.add(
                        "landed"
                    );

                },
                4100
            );


            setTimeout(
                () => {

                    finalLeaf.classList.add(
                        "fading"
                    );

                },
                4700
            );

        }


        if (endingText) {

            endingText.classList.remove(
                "visible"
            );


            setTimeout(
                () => {

                    endingText.classList.add(
                        "visible"
                    );

                },
                5600
            );

        }

    }


    /* =================================================
       6. 离开最终页后允许再次播放
    ================================================= */

    function resetEnding() {

        if (
            state.currentPage === 9
        ) {

            return;

        }


        endingPlayed =
            false;

    }


    /* =================================================
       7. 页面状态循环
    ================================================= */

    function endingLoop() {

        checkEnding();

        resetEnding();

        requestAnimationFrame(
            endingLoop
        );

    }


    endingLoop();


    /* =================================================
       8. 页面加载完成
    ================================================= */

    window.addEventListener(
        "load",
        () => {

            document.body.classList.add(
                "loaded"
            );


            updateProgress();

        }
    );


    /* =================================================
       9. 防止图片拖动
    ================================================= */

    document.addEventListener(
        "dragstart",
        event => {

            if (
                event.target.tagName ===
                "IMG"
            ) {

                event.preventDefault();

            }

        }
    );


    /* =================================================
       10. 防止双击缩放
    ================================================= */

    let lastTouchEnd =
        0;


    document.addEventListener(
        "touchend",
        event => {

            const now =
                Date.now();


            if (
                now -
                lastTouchEnd
                <=
                300
            ) {

                event.preventDefault();

            }


            lastTouchEnd =
                now;

        },
        {
            passive: false
        }
    );


    /* =================================================
       11. 页面可见性
    ================================================= */

    document.addEventListener(
        "visibilitychange",
        () => {

            /*
             * 用户切换标签页后回来，
             * 重新同步当前页面。
             */

            if (
                !document.hidden
            ) {

                if (
                    typeof app.updateCurrentPage ===
                    "function"
                ) {

                    app.updateCurrentPage();

                }


                updateProgress();

            }

        }
    );


    /* =================================================
       12. 错误保护
    ================================================= */

    window.addEventListener(
        "error",
        event => {

            /*
             * 不让单个动画错误
             * 破坏整个网站。
             */

            console.warn(
                "Untitled:",
                event.message
            );

        }
    );


    /* =================================================
       13. 最终初始化
    ================================================= */

    function initialize() {

        /*
         * 页面回到最顶部
         */

        window.scrollTo(
            0,
            0
        );


        state.currentPage =
            0;


        updateProgress();


        /*
         * 第一页激活
         */

        if (
            app.sceneController &&
            typeof app.sceneController.activateScene ===
            "function"
        ) {

            app.sceneController.activateScene(
                0
            );

        }


        /*
         * 初始化叶子
         */

        if (
            app.leafController &&
            typeof app.leafController.render ===
            "function"
        ) {

            app.leafController.render();

        }

    }


    /* =================================================
       14. 延迟初始化
    ================================================= */

    if (
        document.readyState ===
        "complete"
    ) {

        initialize();

    } else {

        window.addEventListener(
            "load",
            initialize,
            {
                once: true
            }
        );

    }


    /* =================================================
       15. 控制台提示
    ================================================= */

    console.log(
        `
        ─────────────────────────────

                    UNTITLED

             Who am I?

        ─────────────────────────────

        The journey has begun.

        ─────────────────────────────
        `
    );


});