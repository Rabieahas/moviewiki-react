# MovieWiki – מידע על סרטים

אפליקציית React לחיפוש סרטים דרך OMDb ולהצגת פרטים נוספים על כל סרט.

## הפעלה

```bash
npm install
npm start
```

בדיקות ובניית גרסה לפריסה:

```bash
npm test -- --watchAll=false
npm run build
```

## מבנה הפרויקט

- `src/pages/Home.jsx` – חיפוש והצגת תוצאות. מונח החיפוש נשמר בכתובת, למשל `/?s=lego`.
- `src/pages/Info.jsx` – פרטי הסרט לפי מזהה IMDb שמתקבל מהנתיב `/info/:id`.
- `src/components/MovieItem.jsx` – כרטיס של סרט ברשימה.
- `src/components/Header.jsx` – אזור עליון וניווט.
- `src/api.js` – בקשות ל־OMDb וניסיון חוזר עם מפתח הגיבוי במקרה של תקלה.
- `src/App.js` – הגדרת הנתיבים באמצעות `react-router-dom`.

הממשק באנגלית, כמו בדוגמאות שבמשימה. קובצי הקוד והעיצוב פרוסים לשורות כדי שיהיה נוח לקרוא ולערוך אותם.
