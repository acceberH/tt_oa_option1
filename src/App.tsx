import { useEffect, useMemo, useState } from "react"
import mixImage from "../assets/cooking/mix.jpg"
import spreadImage from "../assets/cooking/spread.jpg"
import toastImage from "../assets/cooking/toast.jpg"
import finishImage from "../assets/cooking/finish.jpg"

const asset = (name: string) => `/assets/${name}`
const PINK = "#fe2c55"
const TIMER_SECONDS = 8 * 60

type Screen =
  | "feed"
  | "overview"
  | "cook"
  | "complete"
  | "result-picker"
  | "result-preview"
  | "result-settings"
  | "creator-picker"
  | "creator-preview"
  | "creator-settings"
  | "creator-ai"
  | "creator-editor"

type FeedMode = "viewer" | "creator" | "result"

const actions = [
  { id: "like", icon: "4859b.svg", label: "3.1M", name: "Like" },
  { id: "comment", icon: "b24de.svg", label: "45.4K", name: "Comments" },
  { id: "save", icon: "33eb9.svg", label: "233.8K", name: "Save" },
  { id: "share", icon: "b75cc.svg", label: "183.9K", name: "Share" },
] as const

const navItems = [
  { id: "home", icon: "982c0.svg", label: "Home" },
  { id: "friends", icon: "f68b2.svg", label: "Friends", badge: "5" },
  { id: "create", icon: "0a357.svg", label: "Create" },
  { id: "inbox", icon: "b0bf4.svg", label: "Inbox", badge: "23" },
  { id: "profile", icon: "68946.svg", label: "Profile" },
] as const

const stepTitles = [
  "Slice the bread",
  "Make the garlic butter",
  "Spread generously",
  "Bake until golden",
  "Serve warm",
]

const stepImages = [asset("012d6.png"), mixImage, spreadImage, toastImage, finishImage]

const amount = (value: number) =>
  Number.isInteger(value) ? String(value) : String(value).replace(".5", "½")

function StatusBar({ light = false }: { light?: boolean }) {
  return (
    <div
      className={`status-bar ${light ? "status-bar-light" : ""}`}
      aria-hidden="true"
    >
      <span className="status-time">9:41</span>
      <div className="status-levels">
        <img src={asset(light ? "5b990.svg" : "370b7.svg")} alt="" />
        <img src={asset(light ? "13dc8.svg" : "ad90a.svg")} alt="" />
        <span className="battery">
          <span />
          <img src={asset(light ? "474fd.svg" : "23a5a.svg")} alt="" />
        </span>
      </div>
    </div>
  )
}

function Header({ title, onBack }: { title: string onBack: () => void }) {
  return (
    <header className="light-header">
      <StatusBar />
      <button
        type="button"
        onClick={onBack}
        className="back-button"
        aria-label="Back"
      >
        <img src={asset("b46c4.svg")} alt="" />
      </button>
      <h1>{title}</h1>
    </header>
  )
}

function PrimaryButton({
  children,
  onClick,
  secondary = false,
  className = "",
}: {
  children: React.ReactNode
  onClick: () => void
  secondary?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`app-button ${
        secondary ? "app-button-secondary" : "app-button-primary"
      } ${className}`}
    >
      {children}
    </button>
  )
}

function StepPreview({ step, overview = false }: { step: number; overview?: boolean }) {
  const [playing, setPlaying] = useState(true)
  const [replay, setReplay] = useState(0)

  useEffect(() => {
    setPlaying(true)
    setReplay(0)
  }, [step])

  return (
    <aside className={`step-pip ${overview ? "step-pip-overview" : ""}`} aria-label={`Step ${step + 1} visual preview`}>
      <div className="step-pip-media" key={`${step}-${replay}`}>
        <img
          src={stepImages[step]}
          alt={`${stepTitles[step]} visual preview`}
          className={playing ? "step-pip-image" : "step-pip-image is-paused"}
        />
        <button
          type="button"
          className="step-pip-toggle"
          onClick={() => setPlaying((value) => !value)}
          aria-label={playing ? "Pause visual preview" : "Play visual preview"}
        >
          {playing ? "Ⅱ" : "▶"}
        </button>
        <span className="step-pip-progress" style={{ animationPlayState: playing ? "running" : "paused" }} />
      </div>
      <div className="step-pip-caption">
        <span>Step {step + 1} visual</span>
        <button type="button" onClick={() => { setReplay((value) => value + 1); setPlaying(true) }} aria-label="Replay visual preview">↻</button>
      </div>
    </aside>
  )
}

function Feed({
  onOpenRecipe,
  onCreate,
  mode,
  recipeLinked,
  confirmation,
  publishedCaption,
}: {
  onOpenRecipe: () => void
  onCreate: () => void
  mode: FeedMode
  recipeLinked: boolean
  confirmation: string
  publishedCaption: string
}) {
  const [feed, setFeed] = useState<"following" | "for-you">("for-you")
  const [activeNav, setActiveNav] = useState("home")
  const [followed, setFollowed] = useState(false)
  const [selectedActions, setSelectedActions] = useState<string[]>([])

  const toggleAction = (id: string) => {
    if (id === "comment") return
    setSelectedActions((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-black text-white">
      <StatusBar light />
      <img
        src={asset("012d6.png")}
        alt="Crispy garlic butter toast on a dark plate"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18)_0%,transparent_26%,transparent_58%,rgba(0,0,0,0.92)_100%)]" />

      <header className="absolute inset-x-0 top-[54px] z-10 grid h-10 grid-cols-[36px_1fr_36px] items-center px-4">
        <button className="icon-button" aria-label="Open live videos">
          <img
            src={asset("72fa4.svg")}
            alt=""
            className="h-[32.6px] w-[31.6px]"
          />
        </button>
        <div className="flex h-10 items-center justify-center gap-[30px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
          {(["following", "for-you"] as const).map((item) => {
            const active = feed === item
            return (
              <button
                key={item}
                type="button"
                onClick={() => setFeed(item)}
                className={`relative flex h-10 flex-col items-center justify-center text-[18px] leading-[23px] ${
                  active
                    ? "font-['TikTok_Sans:Bold'] font-bold text-white"
                    : "font-['TikTok_Sans:Medium'] font-medium text-white/65"
                }`}
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                {item === "following" ? "Following" : "For you"}
                {item === "following" && !active && (
                  <span className="absolute -right-[7px] -top-px size-2 rounded-full bg-[#fe2c55]" />
                )}
                {active && <span className="absolute bottom-0 h-[3px] w-[29px] bg-white" />}
              </button>
            )
          })}
        </div>
        <button className="icon-button" aria-label="Search">
          <img
            src={asset("9030d.svg")}
            alt=""
            className="h-[23.748px] w-[23px]"
          />
        </button>
      </header>

      {confirmation && (
        <div className="published-confirmation">✓&nbsp; {confirmation}</div>
      )}

      <aside className="absolute bottom-[100px] right-[9px] z-10 flex flex-col items-center gap-[27px]">
        <button
          type="button"
          onClick={() => setFollowed((value) => !value)}
          className="relative size-[49px]"
          aria-label={followed ? "Unfollow @ellacooks" : "Follow @ellacooks"}
          aria-pressed={followed}
        >
          <img src={asset("6e325.png")} alt="" className="size-[49px]" />
          {!followed && (
            <img
              src={asset("58dea.svg")}
              alt=""
              className="absolute left-[13.5px] top-[38px] size-[22px]"
            />
          )}
        </button>
        <div className="flex flex-col items-center gap-5">
          {actions.map((action) => {
            const selected = selectedActions.includes(action.id)
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => toggleAction(action.id)}
                className="action-button flex w-[48px] flex-col items-center"
                aria-label={action.name}
                aria-pressed={action.id === "comment" ? undefined : selected}
              >
                <img
                  src={asset(action.icon)}
                  alt=""
                  className={`size-[34px] transition-transform duration-200 ${
                    selected ? "scale-110" : ""
                  }`}
                />
                <span className="font-['TikTok_Sans:Medium'] text-[13px] font-medium">
                  {mode === "viewer" ? action.label : "0"}
                </span>
              </button>
            )
          })}
          <button
            className="relative mt-[1px] size-[49px]"
            aria-label="Open sound"
          >
            <img
              src={asset("2cbd0.png")}
              alt=""
              className="size-[49px] animate-[spin_8s_linear_infinite]"
            />
            <img
              src={asset("d9fbe.png")}
              alt=""
              className="absolute left-[10px] top-[10px] size-[29px] rounded-full"
            />
          </button>
        </div>
      </aside>

      <section className="absolute bottom-[99px] left-[13px] z-10 w-[min(282px,calc(100%-76px))]">
        {(mode === "viewer" || recipeLinked) && (
          <button
            type="button"
            onClick={onOpenRecipe}
            className="mb-[21px] flex h-8 items-center gap-1 rounded bg-black/40 px-2 pr-3 font-['TikTok_Sans:Medium'] text-sm font-medium"
          >
            <img src={asset("6f651.svg")} alt="" className="size-[19px]" />
            {mode === "result" ? "Original recipe" : "Cook with me"}
          </button>
        )}
        <div className="flex flex-col gap-[11px]">
          <p className="font-['TikTok_Sans:Medium'] text-[18px] font-medium">
            {mode === "result" ? "@you" : "@ellacooks"}
          </p>
          <div className="font-['TikTok_Sans:Regular'] text-base leading-normal text-white/90">
            {mode === "viewer" && (
              <>
                <p>Crispy garlic butter toast</p>
                <p>#easyrecipe #cookwithme</p>
              </>
            )}
            {mode === "creator" &&
              publishedCaption
                .split("\n")
                .map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
            {mode === "result" &&
              publishedCaption
                .split("\n")
                .map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
          </div>
        </div>
      </section>

      <nav className="absolute inset-x-0 bottom-0 z-20 flex h-[87px] items-start border-t-[0.5px] border-[#333] bg-black pt-[7px]">
        {navItems.map((item) => {
          const active = activeNav === item.id
          if (item.id === "create") {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveNav(item.id)
                  onCreate()
                }}
                className="flex h-[54px] flex-1 items-center justify-center"
              >
                <img
                  src={asset(item.icon)}
                  alt=""
                  className="h-[31.25px] w-[46.25px]"
                />
              </button>
            )
          }
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveNav(item.id)}
              className="relative flex h-[54px] flex-1 flex-col items-center justify-end gap-0.5 pb-1.5"
            >
              <img
                src={asset(item.icon)}
                alt=""
                className={`size-[25px] ${active ? "" : "opacity-80"}`}
              />
              <span
                className={`font-['TikTok_Sans:Medium'] text-[10px] ${
                  active ? "text-white" : "text-white/65"
                }`}
              >
                {item.label}
              </span>
              {"badge" in item && (
                <span className="absolute left-[calc(50%+7px)] top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-[9px] bg-[#fe2c55] px-1 text-sm">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </main>
  )
}

function Overview({
  servings,
  setServings,
  onBack,
  onStart,
}: {
  servings: number
  setServings: (value: number) => void
  onBack: () => void
  onStart: () => void
}) {
  return (
    <main className="overview-screen">
      <div className="overview-hero">
        <img src={asset("012d6.png")} alt="Garlic butter toast" />
        <div className="overview-gradient" />
        <StatusBar light />
        <button
          type="button"
          onClick={onBack}
          className="overview-back"
          aria-label="Back to video"
        >
          <img src={asset("126d9.svg")} alt="" />
        </button>
        <div className="overview-title">
          <h1>
            Garlic butter
            <br />
            toast
          </h1>
          <p>By @ellacooks</p>
        </div>
      </div>
      <div className="overview-content">
        <PrimaryButton onClick={onStart}>Start cooking</PrimaryButton>
        <p className="overview-description">
          Crisp edges, a soft middle, and plenty of garlic.
          <br />A simple snack you can make in 15 minutes.
        </p>
        <div className="recipe-stats">
          <div>
            <span>Total time</span>
            <strong>15 min</strong>
          </div>
          <div>
            <span>Servings</span>
            <strong>
              {servings} {servings === 1 ? "person" : "people"}
            </strong>
          </div>
        </div>
        <div className="ingredients-heading">
          <h2>Ingredients</h2>
          <div className="servings-stepper" aria-label="Servings">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              disabled={servings === 1}
            >
              −
            </button>
            <span>{servings} servings</span>
            <button
              onClick={() => setServings(Math.min(4, servings + 1))}
              disabled={servings === 4}
            >
              +
            </button>
          </div>
        </div>
        <ul className="overview-ingredients">
          <li>{amount(servings)} slices sourdough</li>
          <li>{amount(servings)} tbsp softened butter</li>
          <li>{amount(servings)} cloves garlic, minced</li>
          <li>{amount(servings / 2)} tbsp chopped parsley</li>
        </ul>
      </div>
      <StepPreview step={0} overview />
    </main>
  )
}

function TimerCard({
  remaining,
  running,
  touched,
  onStartPause,
  onReset,
}: {
  remaining: number
  running: boolean
  touched: boolean
  onStartPause: () => void
  onReset: () => void
}) {
  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const label = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  const status =
    remaining === 0
      ? "Time’s up"
      : running
        ? "Timer running"
        : touched
          ? "Paused"
          : "Ready to start"

  return (
    <section
      className={`timer-card ${remaining === 0 ? "timer-finished" : ""}`}
      aria-live="polite"
    >
      <strong className="timer-time">{label}</strong>
      <p>8-minute timer · {status}</p>
      <div className="timer-controls">
        <button type="button" onClick={onStartPause}>
          {remaining === 0
            ? "Restart timer"
            : running
              ? "Pause timer"
              : touched
                ? "Resume timer"
                : "Start timer"}
        </button>
        {touched && remaining > 0 && (
          <button type="button" onClick={onReset}>
            Reset
          </button>
        )}
      </div>
    </section>
  )
}

function IngredientsSheet({
  servings,
  onClose,
}: {
  servings: number
  onClose: () => void
}) {
  const items = [
    ["Sourdough", `${amount(servings)} thick slices`],
    ["Softened butter", `${amount(servings)} tbsp`],
    ["Garlic", `${amount(servings)} cloves, minced`],
    ["Parsley", `${amount(servings / 2)} tbsp, chopped`],
  ]
  return (
    <div className="sheet-layer" role="presentation" onClick={onClose}>
      <section
        className="ingredients-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Ingredients"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet-grip" />
        <div className="sheet-title-row">
          <h2>Ingredients</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close ingredients"
          >
            ×
          </button>
        </div>
        <p>Garlic butter toast · {servings} servings</p>
        <div className="sheet-items">
          {items.map(([name, value]) => (
            <div key={name}>
              <strong>{name}</strong>
              <span>{value}</span>
            </div>
          ))}
        </div>
        <p>Your current step stays open underneath.</p>
        <PrimaryButton onClick={onClose} secondary>
          Back to cooking
        </PrimaryButton>
      </section>
    </div>
  )
}

function CookScreen({
  step,
  setStep,
  servings,
  onBackToOverview,
  onFinish,
  remaining,
  running,
  timerTouched,
  onStartPause,
  onReset,
}: {
  step: number
  setStep: (step: number) => void
  servings: number
  onBackToOverview: () => void
  onFinish: () => void
  remaining: number
  running: boolean
  timerTouched: boolean
  onStartPause: () => void
  onReset: () => void
}) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const instructions = [
    `Cut ${amount(servings)} thick ${
      servings === 1 ? "slice" : "slices"
    } of sourdough.`,
    `Mix ${amount(servings)} tbsp softened butter, ${amount(servings)} minced garlic ${
      servings === 1 ? "clove" : "cloves"
    } and ${amount(servings / 2)} tbsp chopped parsley until evenly combined.`,
    "Cover the bread right to the edges with the garlic butter.",
    "Bake at 200°C until the edges are golden and the top is crisp.",
    "Let the toast cool slightly, then serve while warm.",
  ]
  const goBack = () => (step === 0 ? onBackToOverview() : setStep(step - 1))

  return (
    <main className="cook-screen">
      <Header title="Follow along" onBack={goBack} />
      <div className={`cook-content ${step === 3 ? "timer-step-content" : ""}`}>
        {step === 3 ? (
          <>
            <h2 className="timer-recipe-title">
              Garlic butter toast · {servings} servings
            </h2>
            <p className="timer-step-label">Step 4 of 5</p>
            <div className="compact-step complete-step">
              <strong>✓&nbsp; 3 · Spread generously</strong>
              <span>Cover the bread right to the edges.</span>
            </div>
            <div className="active-step compact-active">
              <h2>4 · Bake until golden</h2>
              <p>{instructions[3]}</p>
            </div>
            <TimerCard
              remaining={remaining}
              running={running}
              touched={timerTouched}
              onStartPause={onStartPause}
              onReset={onReset}
            />
            <div className="compact-step">
              <strong>5 · Serve warm</strong>
              <span>Let it cool slightly, then enjoy.</span>
            </div>
            <p className="timer-hint">
              Start the timer when your toast goes in the oven.
            </p>
          </>
        ) : (
          <>
            <p className="recipe-eyebrow">
              Garlic butter toast · {servings} servings
            </p>
            <p className="step-count">Step {step + 1} of 5</p>
            <div className="active-step">
              <h2>
                {step + 1} · {stepTitles[step]}
              </h2>
              <p>{instructions[step]}</p>
            </div>
            <h3>Your steps</h3>
            <ol className="steps-list">
              {stepTitles.map((title, index) => (
                <li key={title} className={index === step ? "current" : ""}>
                  <span>{index < step ? "✓" : index === step ? "→" : ""}</span>
                  {index + 1} · {title}
                </li>
              ))}
            </ol>
            {step === 4 && timerTouched && (
              <button
                type="button"
                className="view-timer"
                onClick={() => setStep(3)}
              >
                View cooking timer
              </button>
            )}
          </>
        )}
      </div>
      <div className="cook-actions">
        <PrimaryButton onClick={() => setSheetOpen(true)} secondary>
          Ingredients
        </PrimaryButton>
        <PrimaryButton
          onClick={() => (step === 4 ? onFinish() : setStep(step + 1))}
        >
          {step === 4 ? "Finish cooking" : "Next step"}
        </PrimaryButton>
      </div>
      <StepPreview step={step} />
      {sheetOpen && (
        <IngredientsSheet
          servings={servings}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </main>
  )
}

function Complete({
  onHeaderBack,
  onBackToVideo,
  onPostResult,
}: {
  onHeaderBack: () => void
  onBackToVideo: () => void
  onPostResult: () => void
}) {
  return (
    <main className="cook-screen">
      <Header title="Follow along" onBack={onHeaderBack} />
      <section className="complete-content">
        <h2>You made it!</h2>
        <p>One saved video. One real-life win.</p>
        <img src={asset("012d6.png")} alt="Finished garlic butter toast" />
        <h3>Made it? Make it yours.</h3>
        <p>
          Create a new TikTok post with your photo or video. The original recipe
          will be linked.
        </p>
        <PrimaryButton onClick={onPostResult}>Post your result</PrimaryButton>
        <PrimaryButton onClick={onBackToVideo} secondary>
          Back to video
        </PrimaryButton>
      </section>
    </main>
  )
}

function MediaPicker({
  onBack,
  onNext,
  onChooseLocal,
}: {
  onBack: () => void
  onNext: () => void
  onChooseLocal: (file: File) => void
}) {
  return (
    <main className="media-picker">
      <StatusBar />
      <div className="picker-title">
        <button type="button" onClick={onBack} aria-label="Cancel">
          ×
        </button>
        <span>Recents⌄</span>
      </div>
      <div className="picker-tabs">
        <span>All</span>
        <span>Videos</span>
        <span>Photos</span>
        <span>Live Photos</span>
      </div>
      <div className="media-grid">
        <button type="button" className="selected-media" onClick={onNext}>
          <img src={asset("012d6.png")} alt="Finished garlic toast" />
          <span>✓&nbsp; Finished toast</span>
        </button>
        <label className="local-media">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) onChooseLocal(file)
            }}
          />
          <strong>＋ Local</strong>
          <span>Photo or video</span>
        </label>
        {Array.from({ length: 10 }).map((_, index) => (
          <button type="button" className="placeholder-media" key={index}>
            <span>
              Video
              <br />
              00:12
            </span>
          </button>
        ))}
      </div>
      <div className="picker-footer">
        <span>✓&nbsp; Select multiple</span>
        <PrimaryButton onClick={onNext}>Next (1)</PrimaryButton>
      </div>
    </main>
  )
}

function MediaPreview({
  mediaUrl,
  mediaType,
  onBack,
  onNext,
}: {
  mediaUrl: string
  mediaType: "image" | "video"
  onBack: () => void
  onNext: () => void
}) {
  return (
    <main className="media-preview">
      <StatusBar light />
      <button
        type="button"
        onClick={onBack}
        className="preview-back"
        aria-label="Back"
      >
        <img src={asset("6a378.svg")} alt="" />
      </button>
      <button type="button" className="add-sound">
        <img src={asset("cc27b.svg")} alt="" />
        Add sound
      </button>
      <div className="preview-toolbar" aria-label="Editing tools">
        <button type="button">
          <img src={asset("3ba7a.svg")} alt="Edit" />
        </button>
        <button type="button" className="text-tool">
          Aa
        </button>
        <button type="button">
          <img src={asset("9065a.svg")} alt="Stickers" />
        </button>
        <button type="button">
          <img src={asset("866a0.svg")} alt="Effects" />
        </button>
      </div>
      <div className="preview-media">
        {mediaType === "video" ? (
          <video src={mediaUrl} controls playsInline />
        ) : (
          <img src={mediaUrl} alt="Selected post preview" />
        )}
      </div>
      <PrimaryButton onClick={onNext} className="preview-next">
        Next
      </PrimaryButton>
    </main>
  )
}

function RecipeDraftPreview({ onClose }: { onClose: () => void }) {
  return (
    <div className="recipe-preview-layer" onClick={onClose} role="presentation">
      <section
        className="recipe-preview-card"
        role="dialog"
        aria-modal="true"
        aria-label="Original recipe preview"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close recipe preview"
        >
          ×
        </button>
        <img src={asset("012d6.png")} alt="Garlic butter toast" />
        <div>
          <span>Original recipe</span>
          <h2>Garlic butter toast</h2>
          <p>By @ellacooks · Attribution confirmed</p>
          <p>8-minute cook timer · {stepTitles.length} guided steps</p>
        </div>
        <PrimaryButton onClick={onClose} secondary>
          Back to post
        </PrimaryButton>
      </section>
    </div>
  )
}

function CreatorAI({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 1400)
    return () => window.clearTimeout(timer)
  }, [onDone])

  return (
    <main className="creator-ai-screen">
      <StatusBar />
      <button type="button" className="creator-ai-back" onClick={onBack} aria-label="Cancel">
        ×
      </button>
      <div className="creator-ai-copy">
        <span className="creator-ai-kicker">AI guide draft</span>
        <h1>Finding the rhythm inside your video.</h1>
        <p>We will suggest ingredients and steps for you to review before posting.</p>
      </div>
      <div className="creator-ai-list" aria-live="polite">
        {['Identifying ingredients', 'Organizing steps', 'Matching video clips'].map((label, index) => (
          <div className="creator-ai-row" key={label}>
            <span className="creator-ai-dot">{index === 0 ? '·' : ''}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <p className="creator-ai-note">AI generation is simulated for this prototype.</p>
    </main>
  )
}

function CreatorEditor({
  onBack,
  onConfirm,
}: {
  onBack: () => void
  onConfirm: (title: string, temperature: string) => void
}) {
  const [title, setTitle] = useState('Garlic butter toast')
  const [temperature, setTemperature] = useState('')
  const [error, setError] = useState(false)

  const confirm = () => {
    if (!temperature.trim()) {
      setError(true)
      return
    }
    onConfirm(title, temperature)
  }

  return (
    <main className="creator-editor-screen">
      <header className="creator-editor-header">
        <button type="button" onClick={onBack} aria-label="Back to post">
          <img src={asset('b46c4.svg')} alt="" />
        </button>
        <div>
          <span>Review & edit</span>
          <strong>Step-by-step guide</strong>
        </div>
        <em>AI draft</em>
      </header>
      <section className="creator-editor-body">
        <h1>Make it yours.</h1>
        <p>Review what AI found, then fill in anything only you would know.</p>
        <div className="creator-editor-section">
          <h2>Guide details</h2>
          <label htmlFor="creator-title">Recipe name</label>
          <input id="creator-title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <div className="creator-editor-fields">
            <div><label htmlFor="creator-servings">Serves</label><input id="creator-servings" value="2 people" readOnly /></div>
            <div><label htmlFor="creator-time">Total time</label><input id="creator-time" value="15 min" readOnly /></div>
          </div>
        </div>
        <div className="creator-editor-section">
          <h2>Ingredients</h2>
          {['2 thick slices · Sourdough', '2 tbsp · Softened butter', '2 cloves · Garlic, minced', '1 tbsp · Parsley, chopped'].map((item) => (
            <div className="creator-editor-line" key={item}>{item}</div>
          ))}
        </div>
        <div className="creator-editor-section">
          <h2>Steps <small>5 clips matched</small></h2>
          {['Slice the bread', 'Make the garlic butter', 'Spread generously', 'Bake until golden', 'Serve warm'].map((step, index) => (
            <div className={`creator-editor-step ${index === 3 ? 'creator-editor-missing' : ''}`} key={step}>
              <b>{index + 1}</b><span>{step}</span>
              {index === 3 && <div className="creator-editor-input"><strong>Needs your input</strong><p>AI found “bake until golden”, but the temperature is not in the video.</p><label htmlFor="creator-temperature">Oven temperature</label><input id="creator-temperature" placeholder="e.g. 200°C" value={temperature} onChange={(event) => { setTemperature(event.target.value); setError(false) }} />{error && <small>Add the oven temperature to continue.</small>}</div>}
            </div>
          ))}
        </div>
      </section>
      <footer className="creator-editor-footer">
        <button type="button" className="creator-editor-secondary">Preview</button>
        <button type="button" className="creator-editor-primary" onClick={confirm}>Confirm guide</button>
      </footer>
    </main>
  )
}

function SettingsRow({
  title,
  detail,
  onClick,
}: {
  title: string
  detail?: string
  onClick?: () => void
}) {
  return (
    <button type="button" className="settings-row" onClick={onClick}>
      <span>
        <strong>{title}</strong>
        {detail && <small>{detail}</small>}
      </span>
      <img src={asset("56c67.svg")} alt="" />
    </button>
  )
}

function PostingSettings({
  kind,
  mediaUrl,
  mediaType,
  caption,
  setCaption,
  audience,
  setAudience,
  recipeAdded,
  setRecipeAdded,
  onAddRecipe,
  onBack,
  onPost,
}: {
  kind: "creator" | "result"
  mediaUrl: string
  mediaType: "image" | "video"
  caption: string
  setCaption: (caption: string) => void
  audience: string
  setAudience: (audience: string) => void
  recipeAdded: boolean
  setRecipeAdded: (value: boolean) => void
  onAddRecipe?: () => void
  onBack: () => void
  onPost: () => void
}) {
  const [recipePreview, setRecipePreview] = useState(false)
  const cycleAudience = () => {
    const options = ["Everyone", "Friends", "Only you"]
    setAudience(options[(options.indexOf(audience) + 1) % options.length])
  }

  return (
    <main className="posting-settings">
      <StatusBar />
      <button
        type="button"
        onClick={onBack}
        className="settings-back"
        aria-label="Back"
      >
        <img src={asset("cdadb.svg")} alt="" />
      </button>
      <textarea
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
        aria-label="Post caption"
      />
      <div className="settings-cover">
        {mediaType === "video" ? (
          <video src={mediaUrl} muted playsInline />
        ) : (
          <img src={mediaUrl} alt="" />
        )}
        <span>Edit cover</span>
      </div>
      <p className="caption-tools">
        # Hashtags&nbsp;&nbsp;&nbsp;&nbsp; @ Mention
      </p>
      <div className="settings-list">
        <SettingsRow title="⌖  Add location" />
        <SettingsRow title="＋  Add link" />
        {kind === "creator" ? (
          <SettingsRow
            title={recipeAdded ? "Recipe added" : "＋  Add recipe"}
            detail={
              recipeAdded
                ? "Viewers can follow along with this video"
                : "Let viewers cook along with your video"
            }
            onClick={onAddRecipe ?? (() => setRecipeAdded(!recipeAdded))}
          />
        ) : (
          <SettingsRow
            title="Recipe: Garlic butter toast"
            detail="From @ellacooks · Linked automatically"
            onClick={() => setRecipePreview(true)}
          />
        )}
        <SettingsRow
          title={`${audience} can view this post`}
          onClick={cycleAudience}
        />
        <SettingsRow
          title="•••  More options"
          detail="Privacy and more settings"
        />
        <SettingsRow title="Share to" />
      </div>
      {kind === "result" && (
        <p className="posting-note">
          Your result will publish as a new TikTok post.
        </p>
      )}
      <div className="posting-actions">
        <button type="button">Drafts</button>
        <PrimaryButton onClick={onPost}>Post</PrimaryButton>
      </div>
      {recipePreview && (
        <RecipeDraftPreview onClose={() => setRecipePreview(false)} />
      )}
    </main>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("feed")
  const [feedMode, setFeedMode] = useState<FeedMode>("viewer")
  const [publishedRecipe, setPublishedRecipe] = useState(true)
  const [confirmation, setConfirmation] = useState("")
  const [servings, setServings] = useState(2)
  const [step, setStep] = useState(0)
  const [remaining, setRemaining] = useState(TIMER_SECONDS)
  const [timerEnd, setTimerEnd] = useState<number | null>(null)
  const [timerTouched, setTimerTouched] = useState(false)
  const [creatorMedia, setCreatorMedia] = useState(asset("012d6.png"))
  const [creatorMediaType, setCreatorMediaType] = useState<"image" | "video">(
    "image",
  )
  const [creatorCaption, setCreatorCaption] = useState(
    "My go-to garlic butter toast\n#easyrecipe #homecooking",
  )
  const [creatorAudience, setCreatorAudience] = useState("Everyone")
  const [creatorRecipe, setCreatorRecipe] = useState(false)
  const [resultMedia, setResultMedia] = useState(asset("012d6.png"))
  const [resultMediaType, setResultMediaType] = useState<"image" | "video">(
    "image",
  )
  const [resultCaption, setResultCaption] = useState(
    "Made @ellacooks’ garlic butter toast\n#cookwithme",
  )
  const [resultAudience, setResultAudience] = useState("Everyone")

  useEffect(() => {
    if (timerEnd === null) return
    const update = () => {
      const next = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000))
      setRemaining(next)
      if (next === 0) setTimerEnd(null)
    }
    update()
    const interval = window.setInterval(update, 250)
    return () => window.clearInterval(interval)
  }, [timerEnd])

  const running = timerEnd !== null
  const timerActions = useMemo(
    () => ({
      toggle: () => {
        setTimerTouched(true)
        if (timerEnd !== null) {
          setRemaining(Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000)))
          setTimerEnd(null)
        } else {
          const startAt = remaining === 0 ? TIMER_SECONDS : remaining
          setRemaining(startAt)
          setTimerEnd(Date.now() + startAt * 1000)
        }
      },
      reset: () => {
        setTimerEnd(null)
        setRemaining(TIMER_SECONDS)
        setTimerTouched(false)
      },
    }),
    [remaining, timerEnd],
  )

  const chooseLocal = (kind: "creator" | "result", file: File) => {
    const url = URL.createObjectURL(file)
    const type = file.type.startsWith("video/") ? "video" : "image"
    if (kind === "creator") {
      setCreatorMedia(url)
      setCreatorMediaType(type)
      setScreen("creator-preview")
    } else {
      setResultMedia(url)
      setResultMediaType(type)
      setScreen("result-preview")
    }
  }

  if (screen === "feed")
    return (
      <Feed
        onOpenRecipe={() => setScreen("overview")}
        onCreate={() => {
          setConfirmation("")
          setScreen("creator-picker")
        }}
        mode={feedMode}
        recipeLinked={publishedRecipe}
        confirmation={confirmation}
        publishedCaption={
          feedMode === "result" ? resultCaption : creatorCaption
        }
      />
    )
  if (screen === "overview") {
    return (
      <Overview
        servings={servings}
        setServings={setServings}
        onBack={() => setScreen("feed")}
        onStart={() => setScreen("cook")}
      />
    )
  }
  if (screen === "complete")
    return (
      <Complete
        onHeaderBack={() => setScreen("cook")}
        onBackToVideo={() => {
          setFeedMode("viewer")
          setConfirmation("")
          setScreen("feed")
        }}
        onPostResult={() => setScreen("result-picker")}
      />
    )
  if (screen === "result-picker")
    return (
      <MediaPicker
        onBack={() => setScreen("complete")}
        onNext={() => setScreen("result-preview")}
        onChooseLocal={(file) => chooseLocal("result", file)}
      />
    )
  if (screen === "creator-picker")
    return (
      <MediaPicker
        onBack={() => setScreen("feed")}
        onNext={() => setScreen("creator-preview")}
        onChooseLocal={(file) => chooseLocal("creator", file)}
      />
    )
  if (screen === "result-preview")
    return (
      <MediaPreview
        mediaUrl={resultMedia}
        mediaType={resultMediaType}
        onBack={() => setScreen("result-picker")}
        onNext={() => setScreen("result-settings")}
      />
    )
  if (screen === "creator-preview")
    return (
      <MediaPreview
        mediaUrl={creatorMedia}
        mediaType={creatorMediaType}
        onBack={() => setScreen("creator-picker")}
        onNext={() => setScreen("creator-settings")}
      />
    )
  if (screen === "creator-ai")
    return (
      <CreatorAI
        onBack={() => setScreen("creator-settings")}
        onDone={() => setScreen("creator-editor")}
      />
    )
  if (screen === "creator-editor")
    return (
      <CreatorEditor
        onBack={() => setScreen("creator-settings")}
        onConfirm={() => {
          setCreatorRecipe(true)
          setScreen("creator-settings")
        }}
      />
    )
  if (screen === "result-settings")
    return (
      <PostingSettings
        kind="result"
        mediaUrl={resultMedia}
        mediaType={resultMediaType}
        caption={resultCaption}
        setCaption={setResultCaption}
        audience={resultAudience}
        setAudience={setResultAudience}
        recipeAdded
        setRecipeAdded={() => {}}
        onBack={() => setScreen("result-preview")}
        onPost={() => {
          setFeedMode("result")
          setPublishedRecipe(true)
          setConfirmation("Posted · Your recipe is linked")
          setScreen("feed")
        }}
      />
    )
  if (screen === "creator-settings")
    return (
      <PostingSettings
        kind="creator"
        mediaUrl={creatorMedia}
        mediaType={creatorMediaType}
        caption={creatorCaption}
        setCaption={setCreatorCaption}
        audience={creatorAudience}
        setAudience={setCreatorAudience}
        recipeAdded={creatorRecipe}
        setRecipeAdded={setCreatorRecipe}
        onAddRecipe={() => setScreen("creator-ai")}
        onBack={() => setScreen("creator-preview")}
        onPost={() => {
          setFeedMode("creator")
          setPublishedRecipe(creatorRecipe)
          setConfirmation(
            creatorRecipe ? "Posted · Your recipe is linked" : "Posted",
          )
          setScreen("feed")
        }}
      />
    )
  return (
    <CookScreen
      step={step}
      setStep={setStep}
      servings={servings}
      onBackToOverview={() => setScreen("overview")}
      onFinish={() => setScreen("complete")}
      remaining={remaining}
      running={running}
      timerTouched={timerTouched}
      onStartPause={timerActions.toggle}
      onReset={timerActions.reset}
    />
  )
}
