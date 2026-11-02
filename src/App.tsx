import { useEffect, useMemo, useRef, useState } from "react"

const assets = "/assets"
const CLIP_SECONDS = 8

function StatusBar({ light = false }: { light?: boolean }) {
  return (
    <div className={`status-bar ${light ? "status-bar-light" : ""}`} aria-hidden="true">
      <span className="status-time">9:41</span>
      <div className="status-levels">
        <img src={`${assets}/${light ? "5b990.svg" : "370b7.svg"}`} alt="" />
        <img src={`${assets}/${light ? "13dc8.svg" : "ad90a.svg"}`} alt="" />
        <span className="status-battery"><span /><img src={`${assets}/${light ? "474fd.svg" : "23a5a.svg"}`} alt="" /></span>
      </div>
    </div>
  )
}

type Screen = "home" | "recipe" | "ingredients" | "cook" | "complete" | "post-picker" | "post-preview" | "published" | "creator-picker" | "creator-publish" | "creator-ai" | "creator-editor" | "creator-published"

type TimerState = "ready" | "running" | "paused" | "finished"

const stepImages = [
  "3075b.png",
  "77b18.png",
  "3f37f.png",
  "5689b.png",
  "dab51.png",
]

const steps = [
  {
    title: "Slice the bread",
    instruction: "Cut 2 thick slices of sourdough.",
  },
  {
    title: "Make the garlic butter",
    instruction:
      "Mix 2 tbsp softened butter, 2 minced garlic cloves and 1 tbsp chopped parsley until evenly combined.",
  },
  {
    title: "Spread generously",
    instruction: "Cover the bread right to the edges with the garlic butter.",
  },
  {
    title: "Bake until golden",
    instruction:
      "Bake at 200°C until the edges are golden and the top is crisp.",
  },
  {
    title: "Serve warm",
    instruction: "Let the toast cool slightly, then serve while warm.",
  },
]

const getStepInstruction = (index: number, servings: number, recipe?: CreatorRecipe) => {
  const edited = recipe?.steps[index]?.instruction
  if (edited && edited !== steps[index].instruction) {
    if (index === 3 && recipe?.temperature) {
      return /\d+\s*°[CF]/.test(edited)
        ? edited.replace(/\d+\s*°[CF]/, recipe.temperature)
        : `${edited} Set the oven to ${recipe.temperature}.`
    }
    return edited
  }
  if (index === 0) {
    return `Cut ${servings} thick ${
      servings === 1 ? "slice" : "slices"
    } of sourdough.`
  }
  if (index === 1) {
    const parsley = servings * 0.5
    return `Mix ${servings} tbsp softened butter, ${servings} minced garlic ${
      servings === 1 ? "clove" : "cloves"
    } and ${parsley} tbsp chopped parsley until evenly combined.`
  }
  if (index === 3 && recipe?.temperature) return steps[index].instruction.replace("200°C", recipe.temperature)
  return steps[index].instruction
}

const baseIngredients = [
  { name: "Sourdough", amount: 1, unit: "slice" },
  { name: "Softened butter", amount: 1, unit: "tbsp" },
  { name: "Garlic", amount: 1, unit: "clove" },
  { name: "Parsley", amount: 0.5, unit: "tbsp chopped" },
]

const pluralize = (value: number, unit: string) => {
  if (value === 1) return unit
  if (unit === "slice") return "slices"
  if (unit === "clove") return "cloves"
  return unit
}

function IconButton({
  src,
  label,
  onClick,
  className = "",
}: {
  src: string
  label: string
  onClick: () => void
  className?: string
}) {
  return (
    <button
      className={`icon-button ${className}`}
      onClick={onClick}
      aria-label={label}
    >
      <img src={`${assets}/${src}`} alt="" />
    </button>
  )
}

function AppHeader({
  title,
  onBack,
  trailing,
}: {
  title: string
  onBack: () => void
  trailing?: React.ReactNode
}) {
  return (
    <header className="app-header">
      <StatusBar />
      <IconButton src="126d9.svg" label="Go back" onClick={onBack} />
      <h1>{title}</h1>
      <div className="header-trailing">{trailing}</div>
    </header>
  )
}

function PrimaryButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}: {
  children: React.ReactNode
  onClick: () => void
  variant?: "primary" | "secondary"
  disabled?: boolean
}) {
  return (
    <button
      className={`primary-button ${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

function HomeScreen({ onOpenRecipe, onCreate, recipeLinked, creatorPost, creatorCaption }: { onOpenRecipe: () => void; onCreate: () => void; recipeLinked: boolean; creatorPost: boolean; creatorCaption: string }) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [followed, setFollowed] = useState(false)

  const actions = [
    {
      icon: "4859b.svg",
      label: liked ? "3.1M+" : "3.1M",
      active: liked,
      action: () => setLiked((value) => !value),
      name: "Like",
    },
    {
      icon: "b24de.svg",
      label: "45.4K",
      active: false,
      action: () => undefined,
      name: "Comments",
    },
    {
      icon: "33eb9.svg",
      label: saved ? "233.8K+" : "233.8K",
      active: saved,
      action: () => setSaved((value) => !value),
      name: "Save",
    },
    {
      icon: "b75cc.svg",
      label: "183.9K",
      active: false,
      action: () => undefined,
      name: "Share",
    },
  ]

  return (
    <main className="home-screen">
      <StatusBar light />
      <div className="home-image" />
      <div className="home-scrim" />

      <header className="feed-header">
        <div className="feed-live" aria-hidden="true">
          <img src={`${assets}/72fa4.svg`} alt="" />
        </div>
        <nav aria-label="Feed">
          <button>
            Following <span className="notification-dot" />
          </button>
          <button className="active">For you</button>
        </nav>
        <img src={`${assets}/9030d.svg`} alt="" />
      </header>

      <aside className="social-actions" aria-label="Video actions">
        <button
          className="creator-avatar"
          onClick={() => setFollowed((value) => !value)}
          aria-label={followed ? "Unfollow ellacooks" : "Follow ellacooks"}
        >
          <img src={`${assets}/6e325.png`} alt="@ellacooks" />
          <span className={followed ? "followed" : ""}>
            {followed ? <img src={`${assets}/7355a.svg`} alt="" /> : "+"}
          </span>
        </button>
        {actions.map((item) => (
          <button
            className={`social-action ${item.active ? "active" : ""}`}
            onClick={item.action}
            key={item.name}
            aria-label={item.name}
            aria-pressed={item.active}
          >
            <img src={`${assets}/${item.icon}`} alt="" />
            <span>{item.label}</span>
          </button>
        ))}
        <button className="music-disc" aria-label="Open sound">
          <img src={`${assets}/2cbd0.png`} alt="" />
          <img src={`${assets}/d9fbe.png`} alt="" />
        </button>
      </aside>

      <section className="video-copy">
        {recipeLinked && <button className="cook-entry" onClick={onOpenRecipe}>
          <img src={`${assets}/6f651.svg`} alt="" />
          Cook with me
        </button>}
        <strong>{creatorPost ? "@you" : "@ellacooks"}</strong>
        <p>{creatorPost ? creatorCaption : <>Crispy garlic butter toast 🧄<br />#easyrecipe #cookwithme</>}</p>
      </section>

      <nav className="bottom-nav" aria-label="Primary navigation">
        {[
          ["982c0.svg", "Home", ""],
          ["f68b2.svg", "Friends", "5"],
          ["0a357.svg", "Create", ""],
          ["b0bf4.svg", "Inbox", "23"],
          ["53901.svg", "Profile", ""],
        ].map(([icon, label, badge]) => (
          <button className={label === "Home" ? "selected" : ""} key={label} onClick={label === "Create" ? onCreate : undefined} disabled={label !== "Create"}>
            <span>
              <img src={`${assets}/${icon}`} alt="" />
              {badge && <b>{badge}</b>}
            </span>
            {label !== "Create" && <small>{label}</small>}
          </button>
        ))}
      </nav>
    </main>
  )
}

function ServingControl({
  servings,
  onChange,
  dark = false,
}: {
  servings: number
  onChange: (servings: number) => void
  dark?: boolean
}) {
  return (
    <div className={`serving-control ${dark ? "dark" : ""}`}>
      <button
        onClick={() => onChange(Math.max(1, servings - 1))}
        disabled={servings === 1}
        aria-label="Decrease servings"
      >
        −
      </button>
      <span>
        {servings} {servings === 1 ? "serving" : "servings"}
      </span>
      <button
        onClick={() => onChange(Math.min(4, servings + 1))}
        disabled={servings === 4}
        aria-label="Increase servings"
      >
        +
      </button>
    </div>
  )
}

function RecipeScreen({
  servings,
  setServings,
  onBack,
  onStart,
  recipe,
  author,
}: {
  servings: number
  setServings: (value: number) => void
  onBack: () => void
  onStart: () => void
  recipe: CreatorRecipe
  author: string
}) {
  return (
    <main className="recipe-screen">
      <StatusBar light />
      <div className="recipe-hero">
        <img src={`${assets}/012d6.png`} alt="Garlic butter toast" />
        <IconButton
          src="126d9.svg"
          label="Back to video"
          onClick={onBack}
          className="hero-back"
        />
      </div>
      <section className="recipe-content">
        <h1>{recipe.title}</h1>
        <p className="byline">By {author}</p>
        <PrimaryButton onClick={onStart}>Start cooking</PrimaryButton>
        <p className="recipe-description">
          Crisp edges, a soft middle, and plenty of garlic.
          <br />A simple snack you can make in 15 minutes.
        </p>
        <div className="recipe-meta">
          <span>
            <small>Total time</small>
            <strong>15 min</strong>
          </span>
          <span>
            <small>Servings</small>
            <strong>{servings} people</strong>
          </span>
        </div>
        <div className="ingredients-title">
          <h2>Ingredients</h2>
          <ServingControl servings={servings} onChange={setServings} dark />
        </div>
        <ul className="recipe-ingredient-list">
          {recipe.ingredients.map((item) => {
            const amount = item.amount * servings
            return (
              <li key={item.name}>
                {amount} {pluralize(amount, item.unit)}{" "}
                {item.name.toLowerCase()}
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}

function IngredientsScreen({
  servings,
  setServings,
  checked,
  setChecked,
  onBack,
  onStart,
  recipe,
}: {
  servings: number
  setServings: (value: number) => void
  checked: boolean[]
  setChecked: React.Dispatch<React.SetStateAction<boolean[]>>
  onBack: () => void
  onStart: () => void
  recipe: CreatorRecipe
}) {
  return (
    <main className="light-screen">
      <AppHeader title="Ingredients" onBack={onBack} />
      <section className="ingredients-page scroll-content">
        <div className="ingredients-heading">
          <div>
            <h2>{recipe.title}</h2>
            <p>Tap each item as you get it ready.</p>
          </div>
          <ServingControl servings={servings} onChange={setServings} />
        </div>
        <div className="ingredient-cards">
          {recipe.ingredients.map((item, index) => {
            const amount = item.amount * servings
            return (
              <button
                className={checked[index] ? "checked" : ""}
                key={item.name}
                onClick={() =>
                  setChecked((current) =>
                    current.map((value, itemIndex) =>
                      itemIndex === index ? !value : value,
                    ),
                  )
                }
              >
                <span className="checkmark">
                  {checked[index] && <img src={`${assets}/7355a.svg`} alt="" />}
                </span>
                <span>
                  <strong>{item.name}</strong>
                  <small>
                    {amount} {pluralize(amount, item.unit)}
                  </small>
                </span>
              </button>
            )
          })}
        </div>
      </section>
      <footer className="sticky-action">
        <PrimaryButton onClick={onStart}>Start cooking</PrimaryButton>
      </footer>
    </main>
  )
}

function TimerSheet({
  state,
  seconds,
  instruction,
  onStart,
  onPause,
  onResume,
  onReset,
  onClose,
  onDone,
  onRestart,
}: {
  state: TimerState
  seconds: number
  instruction: string
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onReset: () => void
  onClose: () => void
  onDone: () => void
  onRestart: () => void
}) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const progress = Math.max(0, seconds / 480)

  return (
    <div className="timer-overlay" role="dialog" aria-modal="true">
      <button
        className="overlay-backdrop"
        onClick={onClose}
        aria-label="Close timer"
      />
      <section className="timer-sheet">
        <div className="sheet-handle" />
        <div className="sheet-heading">
          <div>
            <small>STEP 4</small>
            <h2>
              {state === "finished" ? "Toast is ready" : "Bake until golden"}
            </h2>
          </div>
          <IconButton src="fc709.svg" label="Close timer" onClick={onClose} />
        </div>
        <div
          className={`timer-ring ${state}`}
          style={{ "--progress": progress } as React.CSSProperties}
        >
          <div>
            <strong>
              {String(minutes).padStart(2, "0")}:
              {String(remainingSeconds).padStart(2, "0")}
            </strong>
            <span>
              {state === "ready"
                ? "Ready"
                : state === "paused"
                  ? "Paused"
                  : state === "finished"
                    ? "Done"
                    : "Remaining"}
            </span>
          </div>
        </div>
        <p className="timer-note">
          {instruction}
        </p>
        <div className="timer-actions">
          {state === "ready" && (
            <PrimaryButton onClick={onStart}>Start timer</PrimaryButton>
          )}
          {state === "running" && (
            <>
              <PrimaryButton variant="secondary" onClick={onReset}>
                Reset
              </PrimaryButton>
              <PrimaryButton onClick={onPause}>Pause</PrimaryButton>
            </>
          )}
          {state === "paused" && (
            <>
              <PrimaryButton variant="secondary" onClick={onReset}>
                Reset
              </PrimaryButton>
              <PrimaryButton onClick={onResume}>Resume</PrimaryButton>
            </>
          )}
          {state === "finished" && (
            <><PrimaryButton variant="secondary" onClick={onRestart}>Restart timer</PrimaryButton><PrimaryButton onClick={onDone}>Continue cooking</PrimaryButton></>
          )}
        </div>
      </section>
    </div>
  )
}

function CookScreen({
  servings,
  currentStep,
  setCurrentStep,
  onBack,
  onIngredients,
  onComplete,
  timerState,
  setTimerState,
  timerSeconds,
  setTimerSeconds,
  recipe,
  clipProgress,
  clipPlaying,
  onToggleClip,
  onReplayClip,
  onSeekClip,
}: {
  servings: number
  currentStep: number
  setCurrentStep: (value: number) => void
  onBack: () => void
  onIngredients: () => void
  onComplete: () => void
  timerState: TimerState
  setTimerState: (state: TimerState) => void
  timerSeconds: number
  setTimerSeconds: (seconds: number) => void
  recipe: CreatorRecipe
  clipProgress: number
  clipPlaying: boolean
  onToggleClip: () => void
  onReplayClip: () => void
  onSeekClip: (value: number) => void
}) {
  const [timerOpen, setTimerOpen] = useState(false)
  const [miniVideoOpen, setMiniVideoOpen] = useState(true)
  const [expandedVideo, setExpandedVideo] = useState(false)
  const activeCard = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeCard.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [currentStep])

  return (
    <main className="light-screen">
      <AppHeader title="Follow along" onBack={onBack} />
      <section className="cook-page scroll-content">
        <p className="recipe-kicker">
          {recipe.title} · {servings}{" "}
          {servings === 1 ? "serving" : "servings"}
        </p>
        <div className="step-list">
          {recipe.steps.map((step, index) => (
            <article
              className={`step-card ${
                index === currentStep
                  ? "current"
                  : index < currentStep
                    ? "complete"
                    : ""
              }`}
              key={step.title}
              ref={index === currentStep ? activeCard : undefined}
            >
              <button
                className="step-select"
                onClick={() => setCurrentStep(index)}
              >
                <small>
                  STEP {index + 1}
                  {index === currentStep
                    ? " · CURRENT STEP"
                    : index < currentStep
                      ? " · COMPLETE"
                      : ""}
                </small>
                <span>{getStepInstruction(index, servings, recipe)}</span>
              </button>
              {index === 3 && (
                <button
                  className={`timer-chip ${timerState}`}
                  onClick={() => setTimerOpen(true)}
                >
                  <img src={`${assets}/55a47.svg`} alt="" />
                  {timerState === "running"
                    ? `${Math.floor(timerSeconds / 60)}:${String(timerSeconds % 60).padStart(2, "0")}`
                    : timerState === "finished"
                      ? "Done"
                      : "8 min"}
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      {miniVideoOpen && (
        <div className="mini-video">
          <button
            className="mini-expand"
            onClick={() => setExpandedVideo(true)}
            aria-label={`Expand video for step ${currentStep + 1}`}
          >
            <img
              key={currentStep}
              src={`${assets}/${stepImages[currentStep]}`}
              alt={`Cooking demonstration for ${recipe.steps[currentStep].title}`}
              className="step-video-image"
              style={{ transform: `scale(1.06) translateY(-${clipProgress * 0.025}%)` }}
            />
            <span>Step {currentStep + 1}</span>
          </button>
          <button type="button" className="mini-play-toggle" onClick={onToggleClip} aria-label={clipPlaying ? "Pause step clip" : "Play step clip"}>{clipPlaying ? "Ⅱ" : "▶"}</button>
          <div className="mini-video-progress" aria-hidden="true"><span style={{ width: `${clipProgress}%` }} /></div>
          <button
            className="mini-close"
            onClick={() => setMiniVideoOpen(false)}
            aria-label="Close mini video"
          >
            <img src={`${assets}/12b4a.svg`} alt="" />
          </button>
        </div>
      )}
      {!miniVideoOpen && <button type="button" className="mini-video-tab" onClick={() => setMiniVideoOpen(true)} aria-label="Restore step video">‹</button>}

      <footer className="cook-actions">
        <PrimaryButton variant="secondary" onClick={onIngredients}>
          Ingredients
        </PrimaryButton>
        <PrimaryButton
          onClick={() => {
            if (currentStep === recipe.steps.length - 1) onComplete()
            else setCurrentStep(currentStep + 1)
          }}
        >
          {currentStep === recipe.steps.length - 1 ? "Finish" : "Next step"}
        </PrimaryButton>
      </footer>

      {expandedVideo && (
        <div className="expanded-video" role="dialog" aria-modal="true">
          <img
            key={currentStep}
            src={`${assets}/${stepImages[currentStep]}`}
            alt={`Cooking demonstration for ${recipe.steps[currentStep].title}`}
            className="step-video-image"
            style={{ transform: `scale(1.06) translateY(-${clipProgress * 0.025}%)` }}
          />
          <div className="expanded-video-shade" />
          <IconButton
            src="fc709.svg"
            label="Close video"
            onClick={() => setExpandedVideo(false)}
          />
          <div className="expanded-video-copy">
            <small>STEP {currentStep + 1}</small>
            <h2>{recipe.steps[currentStep].title}</h2>
            <p>{getStepInstruction(currentStep, servings, recipe)}</p>
            <div className="expanded-video-controls">
              <button type="button" onClick={onToggleClip} aria-label={clipPlaying ? "Pause step clip" : "Play step clip"}>{clipPlaying ? "Ⅱ" : "▶"}</button>
              <input type="range" min="0" max="100" step="1" value={Math.round(clipProgress)} onChange={(event) => onSeekClip(Number(event.target.value))} aria-label="Step clip progress" style={{ "--clip-progress": `${clipProgress}%` } as React.CSSProperties} />
              <span>{`0:${String(Math.floor(clipProgress * CLIP_SECONDS / 100)).padStart(2, "0")}`}</span>
              <button type="button" onClick={onReplayClip} aria-label="Replay step clip">↻</button>
            </div>
          </div>
        </div>
      )}

      {timerOpen && (
        <TimerSheet
          state={timerState}
          seconds={timerSeconds}
          instruction={getStepInstruction(3, servings, recipe)}
          onStart={() => setTimerState("running")}
          onPause={() => setTimerState("paused")}
          onResume={() => setTimerState("running")}
          onReset={() => {
            setTimerSeconds(480)
            setTimerState("ready")
          }}
          onClose={() => setTimerOpen(false)}
          onDone={() => {
            setTimerOpen(false)
            setCurrentStep(4)
          }}
          onRestart={() => setTimerState("running")}
        />
      )}
    </main>
  )
}

function CompleteScreen({
  onBack,
  onTakePhoto,
  onUpload,
  onVideo,
}: {
  onBack: () => void
  onTakePhoto: () => void
  onUpload: () => void
  onVideo: () => void
}) {
  const [sourceChooserOpen, setSourceChooserOpen] = useState(false)

  return (
    <main className="light-screen">
      <AppHeader title="Follow along" onBack={onBack} />
      <section className="complete-page">
        <h2>You made it!</h2>
        <p>One saved video. One real-life win.</p>
        <img src={`${assets}/012d6.png`} alt="Finished garlic butter toast" />
        <h3>Made it? Make it yours.</h3>
        <p className="complete-copy">
          Create a new TikTok post with your photo or video. The original recipe
          will be linked.
        </p>
        <PrimaryButton onClick={() => setSourceChooserOpen(true)}>
          Post your result
        </PrimaryButton>
        <PrimaryButton variant="secondary" onClick={onVideo}>
          Back to video
        </PrimaryButton>
      </section>
      {sourceChooserOpen && (
        <div className="source-overlay" role="dialog" aria-modal="true">
          <button
            className="overlay-backdrop"
            onClick={() => setSourceChooserOpen(false)}
            aria-label="Dismiss source chooser"
          />
          <section className="source-sheet">
            <div className="sheet-heading">
              <h2>Post your result</h2>
              <IconButton
                src="fc709.svg"
                label="Close"
                onClick={() => setSourceChooserOpen(false)}
              />
            </div>
            <button onClick={onTakePhoto}>
              <img src={`${assets}/75c80.svg`} alt="" />
              Take photo
            </button>
            <button onClick={onUpload}>
              <img src={`${assets}/106c3.svg`} alt="" />
              Upload from album
            </button>
          </section>
        </div>
      )}
    </main>
  )
}

function PostPicker({
  onClose,
  onNext,
  initialCamera,
}: {
  onClose: () => void
  onNext: () => void
  initialCamera: boolean
}) {
  const cameraOpen = initialCamera
  const [captured, setCaptured] = useState(false)

  if (cameraOpen) {
    return (
      <main className="camera-screen">
        <StatusBar light />
        <div className="camera-viewfinder">
          <img src={`${assets}/012d6.png`} alt="Camera preview" />
        </div>
        <IconButton
          src="e60cc.svg"
          label="Close camera"
          onClick={onClose}
          className="camera-close"
        />
        <div className="camera-tools">
          {[
            "27425.svg",
            "d5618.svg",
            "ba962.svg",
            "dbb0b.svg",
            "823b8.svg",
          ].map((icon) => (
            <img src={`${assets}/${icon}`} alt="" key={icon} />
          ))}
        </div>
        <div className="camera-modes">
          <span>10m</span>
          <span>60s</span>
          <span>15s</span>
          <strong>PHOTO</strong>
          <span>TEXT</span>
        </div>
        <button
          className={`camera-shutter ${captured ? "captured" : ""}`}
          onClick={() => setCaptured(true)}
          aria-label="Take photo"
        />
        {captured && (
          <div className="camera-confirm">
            <button onClick={() => setCaptured(false)}>Retake</button>
            <button onClick={onNext}>Use photo</button>
          </div>
        )}
      </main>
    )
  }

  return (
    <main className="light-screen picker-screen">
      <StatusBar />
      <header className="picker-header">
        <IconButton src="fc709.svg" label="Close" onClick={onClose} />
        <button>
          Recents <img src={`${assets}/3ebc3.svg`} alt="" />
        </button>
        <span />
      </header>
      <nav className="media-tabs">
        <button className="active">All</button>
        <button>Videos</button>
        <button>Photos</button>
        <button>Live Photos</button>
      </nav>
      <div className="media-grid">
        <button className="selected">
          <img src={`${assets}/012d6.png`} alt="Garlic butter toast" />
          <b>1</b>
        </button>
        {Array.from({ length: 8 }, (_, index) => (
          <button className="placeholder" key={index}>
            <span />
            <small>
              Video
              <br />
              00:12
            </small>
          </button>
        ))}
      </div>
      <div className="picker-selection">
        <span>
          <img src={`${assets}/012d6.png`} alt="" />
          <button aria-label="Remove selected media">
            <img src={`${assets}/12b4a.svg`} alt="" />
          </button>
        </span>
      </div>
      <footer className="picker-footer">
        <label>
          <input type="checkbox" defaultChecked /> Select multiple
        </label>
        <PrimaryButton onClick={onNext}>Next (1)</PrimaryButton>
      </footer>
    </main>
  )
}

function PostPreview({
  onBack,
  onPost,
  recipeTitle,
  caption,
  onCaption,
}: {
  onBack: () => void
  onPost: () => void
  recipeTitle: string
  caption: string
  onCaption: (value: string) => void
}) {
  return (
    <main className="post-preview">
      <StatusBar light />
      <div className="post-media">
        <img src={`${assets}/012d6.png`} alt="Selected garlic butter toast" />
        <IconButton src="126d9.svg" label="Back" onClick={onBack} />
      </div>
      <section className="post-form">
        <textarea
          value={caption}
          onChange={(event) => onCaption(event.target.value)}
          aria-label="Post caption"
        />
        <div className="linked-recipe">
          <img src={`${assets}/012d6.png`} alt="" />
          <span>
            <small>Original recipe</small>
            <strong>{recipeTitle}</strong>
            <em>@ellacooks</em>
          </span>
          <img src={`${assets}/56c67.svg`} alt="" />
        </div>
        <button className="post-option">
          <span>Who can view this post</span>
          <span>Everyone ›</span>
        </button>
        <button className="post-option">
          <span>More options</span>
          <span>›</span>
        </button>
      </section>
      <footer className="post-footer">
        <PrimaryButton variant="secondary" onClick={onBack}>
          Drafts
        </PrimaryButton>
        <PrimaryButton onClick={onPost}>Post</PrimaryButton>
      </footer>
    </main>
  )
}

function PublishedScreen({ onDone, recipeTitle }: { onDone: () => void; recipeTitle: string }) {
  return (
    <main className="published-screen">
      <StatusBar light />
      <img src={`${assets}/012d6.png`} alt="Published garlic butter toast" />
      <div className="published-shade" />
      <header>
        <IconButton src="126d9.svg" label="Back to video" onClick={onDone} />
        <strong>Post published</strong>
        <span />
      </header>
      <section>
        <div className="success-mark">
          <img src={`${assets}/7355a.svg`} alt="" />
        </div>
        <h1>Your result is live</h1>
        <p>The original recipe is linked to your post.</p>
        <div className="original-recipe-card">
          <img src={`${assets}/012d6.png`} alt="" />
          <span>
            <small>ORIGINAL RECIPE</small>
            <strong>{recipeTitle}</strong>
            <em>@ellacooks</em>
          </span>
        </div>
        <PrimaryButton onClick={onDone}>Back to video</PrimaryButton>
      </section>
    </main>
  )
}

type CreatorRecipe = {
  title: string
  ingredients: { name: string; amount: number; unit: string }[]
  steps: { title: string; instruction: string }[]
  temperature: string
}

const initialCreatorRecipe = (): CreatorRecipe => ({
  title: "Garlic butter toast",
  ingredients: baseIngredients.map((item) => ({ ...item })),
  steps: steps.map((item) => ({ ...item })),
  temperature: "",
})

function CreatorPublish({
  recipeAdded,
  recipeTitle,
  caption,
  onCaption,
  onBack,
  onAddRecipe,
  onEditRecipe,
  onRemoveRecipe,
  onPost,
}: {
  recipeAdded: boolean
  recipeTitle: string
  caption: string
  onCaption: (value: string) => void
  onBack: () => void
  onAddRecipe: () => void
  onEditRecipe: () => void
  onRemoveRecipe: () => void
  onPost: () => void
}) {
  const [audience, setAudience] = useState("Everyone")
  return (
    <main className="post-preview creator-publish">
      <StatusBar light />
      <div className="post-media">
        <img src={`${assets}/012d6.png`} alt="Garlic butter toast video cover" />
        <IconButton src="126d9.svg" label="Back" onClick={onBack} />
      </div>
      <section className="post-form">
        <textarea value={caption} onChange={(event) => onCaption(event.target.value)} aria-label="Video caption" />
        {recipeAdded ? (
          <div className="linked-recipe">
            <img src={`${assets}/012d6.png`} alt="" />
            <span><small>Recipe attached</small><strong>{recipeTitle}</strong><em>5 guided steps</em></span>
            <button type="button" onClick={onRemoveRecipe} aria-label="Remove recipe">×</button>
          </div>
        ) : (
          <button type="button" className="post-option creator-recipe-entry" onClick={onAddRecipe}><span>Add step-by-step guide</span><span>›</span></button>
        )}
        {recipeAdded && <button type="button" className="post-option" onClick={onEditRecipe}><span>Edit recipe</span><span>›</span></button>}
        <button type="button" className="post-option" onClick={() => setAudience(audience === "Everyone" ? "Friends" : audience === "Friends" ? "Only you" : "Everyone")}><span>Who can view this post</span><span>{audience} ›</span></button>
        <p className="creator-simulation-note">AI generation and publishing are simulated.</p>
      </section>
      <footer className="post-footer"><PrimaryButton variant="secondary" onClick={onBack}>Drafts</PrimaryButton><PrimaryButton onClick={onPost}>Post</PrimaryButton></footer>
    </main>
  )
}

function CreatorAI({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  useEffect(() => {
    const timeout = window.setTimeout(() => onDoneRef.current(), 1300)
    return () => window.clearTimeout(timeout)
  }, [])
  return (
    <main className="light-screen creator-ai">
      <AppHeader title="Add recipe" onBack={onBack} />
      <section><small>AI GUIDE DRAFT</small><h1>Creating your guide</h1><p>Review the details before attaching it to your post.</p><ol><li>Identifying ingredients</li><li>Organizing steps</li><li>Matching video clips</li></ol><p>AI generation is simulated.</p></section>
    </main>
  )
}

function CreatorEditor({
  recipe,
  setRecipe,
  onBack,
  onConfirm,
}: {
  recipe: CreatorRecipe
  setRecipe: React.Dispatch<React.SetStateAction<CreatorRecipe>>
  onBack: () => void
  onConfirm: () => void
}) {
  const [error, setError] = useState(false)
  const setIngredient = (index: number, key: "name" | "amount" | "unit", value: string) => {
    setRecipe((current) => ({ ...current, ingredients: current.ingredients.map((item, i) => i === index ? { ...item, [key]: key === "amount" ? Number(value) || 0 : value } : item) }))
  }
  const setStep = (index: number, key: "title" | "instruction", value: string) => {
    setRecipe((current) => ({ ...current, steps: current.steps.map((item, i) => i === index ? { ...item, [key]: value } : item) }))
  }
  return (
    <main className="light-screen creator-editor">
      <AppHeader title="Review & edit" onBack={onBack} />
      <div className="creator-editor-scroll scroll-content">
        <h1>Make it yours.</h1><p>Review what AI found and add anything missing.</p>
        <section><h2>Guide details</h2><label>Recipe name<input value={recipe.title} onChange={(event) => setRecipe((current) => ({ ...current, title: event.target.value }))} /></label></section>
        <section><h2>Ingredients</h2>{recipe.ingredients.map((item, index) => <div className="creator-ingredient-fields" key={index}><input aria-label={`Ingredient ${index + 1}`} value={item.name} onChange={(event) => setIngredient(index, "name", event.target.value)} /><input aria-label={`Amount ${index + 1}`} type="number" min="0" step="0.5" value={item.amount} onChange={(event) => setIngredient(index, "amount", event.target.value)} /><input aria-label={`Unit ${index + 1}`} value={item.unit} onChange={(event) => setIngredient(index, "unit", event.target.value)} /></div>)}</section>
        <section><h2>Steps</h2>{recipe.steps.map((item, index) => <div className="creator-step-fields" key={index}><strong>Step {index + 1}</strong><input aria-label={`Step ${index + 1} title`} value={item.title} onChange={(event) => setStep(index, "title", event.target.value)} /><textarea aria-label={`Step ${index + 1} instructions`} value={item.instruction} onChange={(event) => setStep(index, "instruction", event.target.value)} />{index === 3 && <div className="creator-missing"><strong>Needs your input</strong><p>The video does not state an oven temperature.</p><label>Oven temperature<input value={recipe.temperature} placeholder="e.g. 200°C" onChange={(event) => { setRecipe((current) => ({ ...current, temperature: event.target.value })); setError(false) }} /></label>{error && <small>Add the temperature to continue.</small>}</div>}</div>)}</section>
      </div>
      <footer className="creator-editor-footer"><PrimaryButton onClick={() => { if (!recipe.temperature.trim()) { setError(true); return } onConfirm() }}>Attach recipe</PrimaryButton></footer>
    </main>
  )
}

function CreatorPublished({ recipeAdded, onViewPost }: { recipeAdded: boolean; onViewPost: () => void }) {
  return <main className="published-screen creator-published"><StatusBar light /><img src={`${assets}/012d6.png`} alt="Garlic butter toast" /><div className="published-shade" /><section><div className="success-mark">✓</div><h1>Post published</h1><p>{recipeAdded ? "Your recipe is attached. Viewers can cook along." : "This video has no recipe attached."}</p><PrimaryButton onClick={onViewPost}>View post</PrimaryButton><small>Publishing is simulated.</small></section></main>
}

function App() {
  const [screen, setScreen] = useState<Screen>("home")
  const [recipeLinked, setRecipeLinked] = useState(true)
  const [feedKind, setFeedKind] = useState<"original" | "creator">("original")
  const [creatorRecipe, setCreatorRecipe] = useState<CreatorRecipe>(initialCreatorRecipe)
  const [creatorRecipeAdded, setCreatorRecipeAdded] = useState(false)
  const [creatorCaption, setCreatorCaption] = useState("My go-to garlic butter toast 🧄 #easyrecipe #homecooking")
  const [resultCaption, setResultCaption] = useState("Made @ellacooks’ garlic butter toast 🧄")
  const [servings, setServings] = useState(2)
  const [checkedIngredients, setCheckedIngredients] = useState([
    true,
    true,
    true,
    false,
  ])
  const [currentStep, setCurrentStep] = useState(0)
  const [clipProgress, setClipProgress] = useState(0)
  const [clipPlaying, setClipPlaying] = useState(true)
  const [timerState, setTimerState] = useState<TimerState>("ready")
  const [timerSeconds, setTimerSeconds] = useState(480)
  const timerEndAt = useRef<number | null>(null)
  const [postSource, setPostSource] = useState<"camera" | "album">("album")

  const history = useMemo(
    () => ({
      recipe: "home" as Screen,
      ingredients: currentStep > 0 ? "cook" as Screen : "recipe" as Screen,
      cook: "ingredients" as Screen,
      complete: "cook" as Screen,
      "post-picker": "complete" as Screen,
      "post-preview": "post-picker" as Screen,
      published: "post-preview" as Screen,
      "creator-picker": "home" as Screen,
      "creator-publish": "creator-picker" as Screen,
      "creator-ai": "creator-publish" as Screen,
      "creator-editor": "creator-publish" as Screen,
      "creator-published": "creator-publish" as Screen,
      home: "home" as Screen,
    }),
    [currentStep],
  )

  useEffect(() => {
    if (timerState !== "running" || timerEndAt.current === null) return
    const update = () => {
      const next = Math.max(0, Math.ceil(((timerEndAt.current ?? 0) - Date.now()) / 1000))
      setTimerSeconds(next)
      if (next === 0) {
        timerEndAt.current = null
        setTimerState("finished")
      }
    }
    update()
    const interval = window.setInterval(update, 250)
    return () => window.clearInterval(interval)
  }, [timerState])

  useEffect(() => {
    setClipProgress(0)
    setClipPlaying(true)
  }, [currentStep])

  useEffect(() => {
    if (screen !== "cook" || !clipPlaying) return
    let lastTick = performance.now()
    const interval = window.setInterval(() => {
      const now = performance.now()
      const elapsed = now - lastTick
      lastTick = now
      setClipProgress((current) => (current + elapsed / (CLIP_SECONDS * 10)) % 100)
    }, 50)
    return () => window.clearInterval(interval)
  }, [screen, clipPlaying])

  const changeTimerState = (next: TimerState) => {
    if (next === "running") {
      const duration = timerSeconds === 0 ? 480 : timerSeconds
      setTimerSeconds(duration)
      timerEndAt.current = Date.now() + duration * 1000
    } else {
      if (next === "paused" && timerEndAt.current !== null) {
        setTimerSeconds(Math.max(0, Math.ceil((timerEndAt.current - Date.now()) / 1000)))
      }
      timerEndAt.current = null
    }
    setTimerState(next)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && screen !== "home") {
        setScreen(history[screen])
      }
      if (screen === "cook" && event.key === "ArrowRight") {
        setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
      }
      if (screen === "cook" && event.key === "ArrowLeft") {
        setCurrentStep(Math.max(0, currentStep - 1))
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [currentStep, history, screen])

  if (screen === "home") {
    return <HomeScreen onOpenRecipe={() => setScreen("recipe")} onCreate={() => setScreen("creator-picker")} recipeLinked={recipeLinked} creatorPost={feedKind === "creator"} creatorCaption={creatorCaption} />
  }
  if (screen === "recipe") {
    return (
      <RecipeScreen
        servings={servings}
        setServings={setServings}
        onBack={() => setScreen("home")}
        onStart={() => setScreen("ingredients")}
        recipe={creatorRecipe}
        author={feedKind === "creator" ? "@you" : "@ellacooks"}
      />
    )
  }
  if (screen === "ingredients") {
    return (
      <IngredientsScreen
        servings={servings}
        setServings={setServings}
        checked={checkedIngredients}
        setChecked={setCheckedIngredients}
        onBack={() => setScreen(currentStep > 0 ? "cook" : "recipe")}
        onStart={() => setScreen("cook")}
        recipe={creatorRecipe}
      />
    )
  }
  if (screen === "cook") {
    return (
      <CookScreen
        servings={servings}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        onBack={() => setScreen("ingredients")}
        onIngredients={() => setScreen("ingredients")}
        onComplete={() => setScreen("complete")}
        timerState={timerState}
        setTimerState={changeTimerState}
        timerSeconds={timerSeconds}
        setTimerSeconds={setTimerSeconds}
        recipe={creatorRecipe}
        clipProgress={clipProgress}
        clipPlaying={clipPlaying}
        onToggleClip={() => setClipPlaying((value) => !value)}
        onReplayClip={() => { setClipProgress(0); setClipPlaying(true) }}
        onSeekClip={setClipProgress}
      />
    )
  }
  if (screen === "complete") {
    return (
      <CompleteScreen
        onBack={() => setScreen("cook")}
        onTakePhoto={() => {
          setPostSource("camera")
          setScreen("post-picker")
        }}
        onUpload={() => {
          setPostSource("album")
          setScreen("post-picker")
        }}
        onVideo={() => setScreen("home")}
      />
    )
  }
  if (screen === "post-picker") {
    return (
      <PostPicker
        onClose={() => setScreen("complete")}
        onNext={() => setScreen("post-preview")}
        initialCamera={postSource === "camera"}
      />
    )
  }
  if (screen === "post-preview") {
    return (
      <PostPreview
        onBack={() => setScreen("post-picker")}
        onPost={() => setScreen("published")}
        recipeTitle={creatorRecipe.title}
        caption={resultCaption}
        onCaption={setResultCaption}
      />
    )
  }
  if (screen === "creator-picker") {
    return <PostPicker onClose={() => setScreen("home")} onNext={() => setScreen("creator-publish")} initialCamera={false} />
  }
  if (screen === "creator-publish") {
    return <CreatorPublish recipeAdded={creatorRecipeAdded} recipeTitle={creatorRecipe.title} caption={creatorCaption} onCaption={setCreatorCaption} onBack={() => setScreen("creator-picker")} onAddRecipe={() => setScreen("creator-ai")} onEditRecipe={() => setScreen("creator-editor")} onRemoveRecipe={() => setCreatorRecipeAdded(false)} onPost={() => { setRecipeLinked(creatorRecipeAdded); setFeedKind("creator"); setScreen("creator-published") }} />
  }
  if (screen === "creator-ai") {
    return <CreatorAI onBack={() => setScreen("creator-publish")} onDone={() => setScreen("creator-editor")} />
  }
  if (screen === "creator-editor") {
    return <CreatorEditor recipe={creatorRecipe} setRecipe={setCreatorRecipe} onBack={() => setScreen("creator-publish")} onConfirm={() => { setCreatorRecipeAdded(true); setScreen("creator-publish") }} />
  }
  if (screen === "creator-published") {
    return <CreatorPublished recipeAdded={creatorRecipeAdded} onViewPost={() => setScreen("home")} />
  }
  return <PublishedScreen onDone={() => setScreen("home")} recipeTitle={creatorRecipe.title} />
}

export default App
