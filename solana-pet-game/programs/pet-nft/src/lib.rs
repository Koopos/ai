use anchor_lang::prelude::*;
use anchor_spl::{
    metadata::{create_metadata_accounts_v3, CreateMetadataAccountsV3},
    token::{mint_to, MintTo},
};
use std::str::FromStr;

declare_id!("Pet111111111111111111111111111111111111111");

#[program]
pub mod pet_nft {
    use super::*;

    /// 创建新宠物
    pub fn create_pet(
        ctx: Context<CreatePet>,
        name: String,
        uri: String,
    ) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        // 随机生成属性
        let randomness = Clock::get()?.unix_timestamp as u64;
        let strength = (randomness % 100) as u8 + 1;
        let agility = ((randomness / 100) % 100) as u8 + 1;
        let intelligence = ((randomness / 10000) % 100) as u8 + 1;

        // 确定稀有度
        let rarity = calculate_rarity(strength, agility, intelligence);

        pet.owner = ctx.accounts.owner.key();
        pet.name = name;
        pet.uri = uri;
        pet.strength = strength;
        pet.agility = agility;
        pet.intelligence = intelligence;
        pet.rarity = rarity;
        pet.level = 1;
        pet.experience = 0;
        pet.hunger = 100;
        pet.happiness = 100;
        pet.birth_time = clock.unix_timestamp;
        pet.last_fed_time = clock.unix_timestamp;
        pet.is_alive = true;
        pet.breed_count = 0;

        emit!(PetCreated {
            owner: pet.owner,
            name: pet.name.clone(),
            rarity: pet.rarity,
        });

        Ok(())
    }

    /// 喂食宠物
    pub fn feed_pet(ctx: Context<FeedPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;
        let clock = Clock::get()?;

        require!(pet.is_alive, PetError::PetDead);
        require!(pet.owner == ctx.accounts.owner.key(), PetError::NotOwner);

        // 恢复饥饿值
        pet.hunger = std::cmp::min(pet.hunger + 30, 100);
        pet.happiness = std::cmp::min(pet.happiness + 10, 100);
        pet.last_fed_time = clock.unix_timestamp;

        // 小概率增加经验
        if pet.experience < 1000 {
            pet.experience += 5;
        }

        // 检查升级
        check_level_up(pet)?;

        emit!(PetFed {
            pet_id: pet.key(),
            hunger: pet.hunger,
        });

        Ok(())
    }

    /// 训练宠物
    pub fn train_pet(ctx: Context<TrainPet>, attribute: AttributeType) -> Result<()> {
        let pet = &mut ctx.accounts.pet;

        require!(pet.is_alive, PetError::PetDead);
        require!(pet.owner == ctx.accounts.owner.key(), PetError::NotOwner);
        require!(pet.hunger > 20, PetError::PetTooHungry);

        // 训练消耗饥饿值
        pet.hunger = pet.hunger.saturating_sub(20);
        pet.experience += 15;

        // 提升属性
        match attribute {
            AttributeType::Strength => {
                pet.strength = std::cmp::min(pet.strength + 2, 255);
            }
            AttributeType::Agility => {
                pet.agility = std::cmp::min(pet.agility + 2, 255);
            }
            AttributeType::Intelligence => {
                pet.intelligence = std::cmp::min(pet.intelligence + 2, 255);
            }
        }

        check_level_up(pet)?;

        emit!(PetTrained {
            pet_id: pet.key(),
            attribute: attribute as u8,
        });

        Ok(())
    }

    /// 繁殖宠物
    pub fn breed_pets(
        ctx: Context<BreedPets>,
        child_name: String,
        child_uri: String,
    ) -> Result<()> {
        let parent1 = &ctx.accounts.parent1;
        let parent2 = &ctx.accounts.parent2;
        let child = &mut ctx.accounts.child;
        let clock = Clock::get()?;

        require!(parent1.is_alive && parent2.is_alive, PetError::PetDead);
        require!(parent1.owner == ctx.accounts.owner.key(), PetError::NotOwner);
        require!(parent2.owner == ctx.accounts.owner.key(), PetError::NotOwner);
        require!(parent1.breed_count < 5 && parent2.breed_count < 5, PetError::MaxBreedsReached);
        require!(parent1.level >= 5 && parent2.level >= 5, PetError::LevelTooLow);

        // 遗传属性 (取平均值 + 随机变异)
        let randomness = clock.unix_timestamp as u64;
        let mutation = (randomness % 20) as i16 - 10; // -10 到 +10 的变异

        child.owner = ctx.accounts.owner.key();
        child.name = child_name;
        child.uri = child_uri;
        child.strength = clamp(((parent1.strength + parent2.strength) / 2) as i16 + mutation);
        child.agility = clamp(((parent1.agility + parent2.agility) / 2) as i16 + mutation);
        child.intelligence = clamp(((parent1.intelligence + parent2.intelligence) / 2) as i16 + mutation);
        child.rarity = calculate_rarity(child.strength, child.agility, child.intelligence);
        child.level = 1;
        child.experience = 0;
        child.hunger = 100;
        child.happiness = 100;
        child.birth_time = clock.unix_timestamp;
        child.last_fed_time = clock.unix_timestamp;
        child.is_alive = true;
        child.breed_count = 0;
        child.parent1 = Some(parent1.key());
        child.parent2 = Some(parent2.key());

        // 增加父母的繁殖次数
        let parent1 = &mut ctx.accounts.parent1;
        let parent2 = &mut ctx.accounts.parent2;
        parent1.breed_count += 1;
        parent2.breed_count += 1;

        emit!(PetBred {
            owner: ctx.accounts.owner.key(),
            child_id: child.key(),
            parent1_id: parent1.key(),
            parent2_id: parent2.key(),
        });

        Ok(())
    }

    /// 宠物战斗
    pub fn battle(ctx: Context<Battle>) -> Result<()> {
        let pet1 = &mut ctx.accounts.pet1;
        let pet2 = &mut ctx.accounts.pet2;

        require!(pet1.is_alive && pet2.is_alive, PetError::PetDead);
        require!(pet1.owner == ctx.accounts.owner.key(), PetError::NotOwner);

        // 计算战斗力
        let power1 = calculate_battle_power(pet1);
        let power2 = calculate_battle_power(pet2);

        // 加入随机因素
        let randomness = Clock::get()?.unix_timestamp as u64;
        let luck1 = (randomness % 30) as i32;
        let luck2 = ((randomness / 100) % 30) as i32;

        let final_power1 = power1 + luck1;
        let final_power2 = power2 + luck2;

        let winner = if final_power1 > final_power2 {
            1
        } else {
            2
        };

        // 胜者获得经验和属性提升
        if winner == 1 {
            pet1.experience += 50;
            pet1.strength = std::cmp::min(pet1.strength + 1, 255);
            check_level_up(pet1)?;
        } else {
            pet2.experience += 50;
            pet2.strength = std::cmp::min(pet2.strength + 1, 255);
            check_level_up(pet2)?;
        }

        emit!(BattleComplete {
            pet1_id: pet1.key(),
            pet2_id: pet2.key(),
            winner: winner,
        });

        Ok(())
    }

    /// 转移宠物
    pub fn transfer_pet(ctx: Context<TransferPet>) -> Result<()> {
        let pet = &mut ctx.accounts.pet;

        require!(pet.owner == ctx.accounts.owner.key(), PetError::NotOwner);

        pet.owner = ctx.accounts.new_owner.key();

        emit!(PetTransferred {
            pet_id: pet.key(),
            old_owner: ctx.accounts.owner.key(),
            new_owner: ctx.accounts.new_owner.key(),
        });

        Ok(())
    }
}

// ---------- Accounts ----------

#[derive(Accounts)]
#[instruction(name: String, uri: String)]
pub struct CreatePet<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Pet::INIT_SPACE,
        seeds = [b"pet", owner.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub pet: Account<'info, Pet>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FeedPet<'info> {
    #[account(mut, seeds = [b"pet", owner.key().as_ref(), pet.name.as_bytes()], bump)]
    pub pet: Account<'info, Pet>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct TrainPet<'info> {
    #[account(mut, seeds = [b"pet", owner.key().as_ref(), pet.name.as_bytes()], bump)]
    pub pet: Account<'info, Pet>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(child_name: String, child_uri: String)]
pub struct BreedPets<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Pet::INIT_SPACE,
        seeds = [b"pet", owner.key().as_ref(), child_name.as_bytes()],
        bump
    )]
    pub child: Account<'info, Pet>,
    #[account(mut, seeds = [b"pet", owner.key().as_ref(), parent1.name.as_bytes()], bump)]
    pub parent1: Account<'info, Pet>,
    #[account(mut, seeds = [b"pet", owner.key().as_ref(), parent2.name.as_bytes()], bump)]
    pub parent2: Account<'info, Pet>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Battle<'info> {
    #[account(mut, seeds = [b"pet", owner.key().as_ref(), pet1.name.as_bytes()], bump)]
    pub pet1: Account<'info, Pet>,
    #[account(mut)]
    pub pet2: Account<'info, Pet>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct TransferPet<'info> {
    #[account(mut, seeds = [b"pet", owner.key().as_ref(), pet.name.as_bytes()], bump)]
    pub pet: Account<'info, Pet>,
    pub owner: Signer<'info>,
    /// CHECK: 新主人地址
    pub new_owner: AccountInfo<'info>,
}

// ---------- Data Structures ----------

#[account]
#[derive(InitSpace)]
pub struct Pet {
    pub owner: Pubkey,
    #[max_len(32)]
    pub name: String,
    #[max_len(200)]
    pub uri: String, // 元数据URI
    pub strength: u8,     // 力量 1-255
    pub agility: u8,      // 敏捷 1-255
    pub intelligence: u8, // 智力 1-255
    pub rarity: u8,       // 稀有度: 1=普通, 2=稀有, 3=史诗, 4=传说
    pub level: u8,        // 等级
    pub experience: u16,  // 经验值
    pub hunger: u8,       // 饥饿值 0-100
    pub happiness: u8,    // 快乐值 0-100
    pub birth_time: i64,  // 出生时间
    pub last_fed_time: i64, // 上次喂食时间
    pub is_alive: bool,   // 是否存活
    pub breed_count: u8,  // 繁殖次数
    pub parent1: Option<Pubkey>, // 父母1
    pub parent2: Option<Pubkey>, // 父母2
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy)]
pub enum AttributeType {
    Strength,
    Agility,
    Intelligence,
}

// ---------- Events ----------

#[event]
pub struct PetCreated {
    pub owner: Pubkey,
    pub name: String,
    pub rarity: u8,
}

#[event]
pub struct PetFed {
    pub pet_id: Pubkey,
    pub hunger: u8,
}

#[event]
pub struct PetTrained {
    pub pet_id: Pubkey,
    pub attribute: u8,
}

#[event]
pub struct PetBred {
    pub owner: Pubkey,
    pub child_id: Pubkey,
    pub parent1_id: Pubkey,
    pub parent2_id: Pubkey,
}

#[event]
pub struct BattleComplete {
    pub pet1_id: Pubkey,
    pub pet2_id: Pubkey,
    pub winner: u8,
}

#[event]
pub struct PetTransferred {
    pub pet_id: Pubkey,
    pub old_owner: Pubkey,
    pub new_owner: Pubkey,
}

// ---------- Errors ----------

#[error_code]
pub enum PetError {
    #[msg("宠物已死亡")]
    PetDead,
    #[msg("不是宠物主人")]
    NotOwner,
    #[msg("宠物太饿了")]
    PetTooHungry,
    #[msg("达到最大繁殖次数")]
    MaxBreedsReached,
    #[msg("等级太低")]
    LevelTooLow,
}

// ---------- Helper Functions ----------

fn calculate_rarity(strength: u8, agility: u8, intelligence: u8) -> u8 {
    let total = strength as u16 + agility as u16 + intelligence as u16;
    if total > 250 {
        4 // 传说
    } else if total > 200 {
        3 // 史诗
    } else if total > 150 {
        2 // 稀有
    } else {
        1 // 普通
    }
}

fn calculate_battle_power(pet: &Pet) -> i32 {
    (pet.strength as i32 * 2 + pet.agility as i32 + pet.intelligence as i32)
        * (pet.level as i32)
        * (pet.happiness as i32) / 100
}

fn check_level_up(pet: &mut Pet) -> Result<()> {
    let exp_needed = pet.level as u16 * 100;
    if pet.experience >= exp_needed && pet.level < 100 {
        pet.level += 1;
        pet.experience -= exp_needed;
        pet.strength = std::cmp::min(pet.strength + 3, 255);
        pet.agility = std::cmp::min(pet.agility + 3, 255);
        pet.intelligence = std::cmp::min(pet.intelligence + 3, 255);
    }
    Ok(())
}

fn clamp(value: i16) -> u8 {
    if value < 1 {
        1
    } else if value > 255 {
        255
    } else {
        value as u8
    }
}
