extends StaticBody2D

const SPEED = 250.0
const SCREEN_WIDTH = 432

var _has_scored := false

signal scored()
signal off_screen()
signal player_hit()

func _ready() -> void:
	$CollisionArea.body_entered.connect(_on_collision_body_entered)

func _physics_process(delta: float) -> void:
	position.x -= SPEED * delta

	if position.x < -100:
		queue_free()
		off_screen.emit()

func set_gap_position(y_position: float) -> void:
	global_position = Vector2(SCREEN_WIDTH + 100, y_position)

func _on_collision_body_entered(body: Node) -> void:
	if body.is_in_group("player"):
		player_hit.emit()

func get_score_area() -> Area2D:
	return $ScoreArea

func has_scored() -> bool:
	return _has_scored

func mark_scored() -> void:
	_has_scored = true
