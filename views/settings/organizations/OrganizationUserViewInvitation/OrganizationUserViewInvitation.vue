<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts" src="./OrganizationUserViewInvitation.ts" />

<template>
    <v-container>
        <div>
            <v-row class="ma-0" align="center" style="height: 52px;">
                <v-col class="flex-grow-1 ma-0 pa-0 d-flex align-center">
                    <k-standard-view-title-icon icon="fa-fw fa-user"/>
                    <k-standard-view-title :title="$t('views.settings-organization-user.invite-person')"/>
                </v-col>
            </v-row>

            <v-form
                ref="form"
                autocomplete="off"
                @submit.prevent=""
            >
                <v-card>
                    <k-form-alert
                        :http-error="previousError"
                        metadata="organization_user"
                    />

                    <k-card-section locked dense>
                        <v-row>
                            <k-col-label
                                :label="$mfl('user', 'email')"
                                edit-mode
                                edit-label-required
                            >
                                <template v-slot:edit>
                                    <k-form-email
                                        ref="email"
                                        autofocus
                                        v-model="email"
                                        :disabled="loading"
                                        :rules="[$r('required')]"
                                        @keydown.enter="send"
                                    />
                                </template>
                            </k-col-label>
                        </v-row>

                        <v-row>
                            <k-col-label>
                                <v-btn
                                    color="primary"
                                    depressed
                                    class="ma-0"
                                    block
                                    :disabled="!email"
                                    :loading="loading"
                                    @click="send"
                                >
                                    {{ $t('views.settings-organization-user.invite') }}

                                    <v-icon
                                        right
                                        dark
                                        small
                                    >
                                        fa-fw fa-paper-plane
                                    </v-icon>
                                </v-btn>
                            </k-col-label>
                        </v-row>
                    </k-card-section>
                </v-card>
            </v-form>
        </div>
    </v-container>
</template>
