<template>
	<div class="set_nickname">
		<van-cell-group>
			<van-field v-model="nickName" label="昵称" />
		</van-cell-group>

		<div class="bottom_btn">
			<van-button size="large" type="danger" @click="saveNick">保存</van-button>
		</div>
	</div>
</template>


<script>
	import {
		Field
	} from 'vant';
	import {
		storage
	} from '@/common/util';

	export default {
		data() {
			return {
				nickName: ''
			};
		},

		created() {
			this.getNick();
		},

		methods: {
			getNick() {
				this.nickName = storage.get('nickName') || '';
			},
			saveNick() {
				/*if (true) {
				  this.$reqPut(USER_PROFILE, { nick_name: this.nickName })
				    .then(res => {
				      localStorage.setItem('nick_name', res.data.data.nick_name);
				      return this.$dialog.alert({ message: '保存成功' });
				    })
				    .then(() => {
				      this.$router.go(-1);
				    });
				}*/
			}
		},

		components: {
			[Field.name]: Field
		}
	};
</script>


<style scoped>
	.bottom_btn {
		padding: 30px 15px 0 15px;
	}
</style>
