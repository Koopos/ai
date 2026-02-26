extends CanvasLayer

signal start_game()
signal restart_game()

@onready var score_label: Label = $ScoreLabel
@onready var start_screen: Control = $StartScreen
@onready var start_button: Button = $StartScreen/StartButton
@onready var game_over_screen: Control = $GameOverScreen
@onready var game_over_score_label: Label = $GameOverScreen/ScoreLabel
@onready var game_over_best_label: Label = $GameOverScreen/BestLabel
@onready var restart_button: Button = $GameOverScreen/RestartButton

var _best_score := 0

func _ready() -> void:
	start_button.pressed.connect(_on_start_pressed)
	restart_button.pressed.connect(_on_restart_pressed)
	hide_game_over()

func update_score(score: int) -> void:
	score_label.text = str(score)

func show_game_over(score: int) -> void:
	if score > _best_score:
		_best_score = score

	game_over_score_label.text = "Score: %d" % score
	game_over_best_label.text = "Best: %d" % _best_score
	game_over_screen.visible = true
	start_screen.visible = false

func hide_game_over() -> void:
	game_over_screen.visible = false

func show_start_screen() -> void:
	start_screen.visible = true
	hide_game_over()

func hide_start_screen() -> void:
	start_screen.visible = false

func _on_start_pressed() -> void:
	hide_start_screen()
	start_game.emit()

func _on_restart_pressed() -> void:
	hide_game_over()
	restart_game.emit()
