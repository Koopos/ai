extends StaticBody2D

const SPEED = 250.0
const SCREEN_WIDTH = 432

signal player_hit_ground()

func _ready() -> void:
	$HitArea.body_entered.connect(_on_body_entered)

func _physics_process(delta: float) -> void:
	position.x -= SPEED * delta

	if position.x <= -SCREEN_WIDTH / 2:
		position.x = SCREEN_WIDTH / 2 + position.x

func _on_body_entered(body: Node) -> void:
	if body.is_in_group("player"):
		player_hit_ground.emit()
