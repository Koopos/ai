extends CharacterBody2D

const GRAVITY = 1800.0
const FLAP_STRENGTH = -500.0
const MAX_FALL_SPEED = 1000.0

var _velocity := Vector2.ZERO
var _is_dead := false

signal died()
signal scored()

func _ready() -> void:
	_velocity = Vector2.ZERO
	for child in get_children():
		if child is ColorRect:
			child.visible = true

func _physics_process(delta: float) -> void:
	if _is_dead:
		return

	# Apply gravity
	_velocity.y += GRAVITY * delta
	_velocity.y = min(_velocity.y, MAX_FALL_SPEED)

	# Update rotation based on velocity
	if _velocity.y < 0:
		rotation = -0.3
	else:
		rotation = min(_velocity.y / 1000.0, 1.5)

	# Move and check collision
	velocity = _velocity
	move_and_slide()

	# Check if player fell off screen
	if global_position.y > 1000:
		_die()

func flap() -> void:
	if _is_dead:
		return
	_velocity.y = FLAP_STRENGTH

func _die() -> void:
	if _is_dead:
		return

	_is_dead = true
	died.emit()

func reset() -> void:
	_is_dead = false
	_velocity = Vector2.ZERO
	position = Vector2(200, 400)
	rotation = 0
	visible = true

	# Ensure all visual elements are visible
	for child in get_children():
		child.visible = true

	print("Player reset at position: ", position)
