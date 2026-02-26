extends Node2D

@onready var player: CharacterBody2D = $Player
@onready var ground: StaticBody2D = $Ground
@onready var pipes: Node2D = $Pipes
@onready var pipe_spawner: Timer = $PipeSpawner
@onready var ui: CanvasLayer = $UI

const PIPE_SCENE = preload("res://scenes/pipe.tscn")
const MIN_PIPE_Y = 200
const MAX_PIPE_Y = 600

var _score := 0
var _is_playing := false
var _pipes_active := []

func _ready() -> void:
	player.add_to_group("player")
	ui.show_start_screen()
	pipe_spawner.stop()

func _input(event: InputEvent) -> void:
	if not _is_playing:
		return

	if event.is_action_pressed("flap"):
		player.flap()

func _on_pipe_spawner_timeout() -> void:
	if not _is_playing:
		return

	var pipe = PIPE_SCENE.instantiate()
	var pipe_y = randf_range(MIN_PIPE_Y, MAX_PIPE_Y)
	pipe.set_gap_position(pipe_y)

	pipe.player_hit.connect(_on_pipe_player_hit)
	pipe.get_score_area().body_entered.connect(_on_score_area_entered.bind(pipe))

	pipes.add_child(pipe)
	_pipes_active.append(pipe)

func _on_pipe_player_hit() -> void:
	_game_over()

func _on_score_area_entered(pipe: StaticBody2D, body: Node) -> void:
	if body.is_in_group("player") and not pipe.has_scored():
		pipe.mark_scored()
		_score += 1
		ui.update_score(_score)

func _on_player_died() -> void:
	_game_over()

func _on_ground_player_hit() -> void:
	_game_over()

func _game_over() -> void:
	_is_playing = false
	pipe_spawner.stop()
	ui.show_game_over(_score)

func _on_ui_start_game() -> void:
	_start_game()

func _on_ui_restart_game() -> void:
	_reset_game()
	_start_game()

func _start_game() -> void:
	_is_playing = true
	_score = 0
	ui.update_score(0)
	player.reset()
	pipe_spawner.start()

func _reset_game() -> void:
	_score = 0

	for pipe in _pipes_active:
		pipe.queue_free()

	_pipes_active.clear()
	player.reset()
