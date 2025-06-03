import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';

export async function generateAvatarDataUri(seed: string) {
    const avatar = createAvatar(botttsNeutral, {
        seed,
        scale: 100,
        radius: 20,
        // Optional: add style options here (like backgroundColor)
    });
    return avatar.toString()
}