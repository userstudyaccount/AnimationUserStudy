// List of clips with model versions
const clips = [
    "clip01", "clip02", "clip03" // add more clip IDs here
  ];

  const models = ["A", "B", "C"];

  let timeline = [
    {
      type: 'preload',
      video: clips.flatMap(clip => models.map(m => `stimuli/${clip}_${m}.mp4`))
    }
  ];

  // Shuffle helper
  function shuffle(array) {
    let a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  clips.forEach((clip_id, index) => {
    const model_order = shuffle(models);
    const videos_html = model_order.map(m =>
      `<div><video controls><source src='stimuli/${clip_id}_${m}.mp4' type='video/mp4'></video><p>Model ${m}</p></div>`
    ).join("");

    const trial = {
      type: 'survey-html-form',
      preamble: `<div class='video-container'>${videos_html}</div>`,
      html: `
        <div class='ranking-form'>
          <p>Rank each model (1 = best, 3 = worst):</p>
          ${model_order.map(m => `
            <label>Model ${m}:
              <input name="rank_${clip_id}_${m}" type="radio" value="1" required>1
              <input name="rank_${clip_id}_${m}" type="radio" value="2">2
              <input name="rank_${clip_id}_${m}" type="radio" value="3">3
            </label><br>
          `).join("")}
        </div>
      `,
      data: { clip: clip_id, models: model_order },
      on_finish: function(data) {
        data.response = JSON.parse(data.responses);
      }
    };

    timeline.push(trial);
  });
